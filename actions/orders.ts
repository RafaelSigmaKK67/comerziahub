"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FulfillmentType, OrderStatus, PaymentMethod } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { generateOrderCode, toNumber } from "@/lib/utils";
import { haversineKm, calcDeliveryFee, estimateMinutes } from "@/lib/delivery";
import {
  calcCashback,
  cashbackReleaseDate,
  cashbackExpiryDate,
} from "@/lib/cashback";
import { resolveTier } from "@/lib/loyalty";

/**
 * Finaliza a compra: divide o carrinho por loja, cria um pedido para cada uma
 * (com itens, pagamento, entrega, cashback, fidelidade e baixa de estoque) e
 * limpa o carrinho. Redireciona para o acompanhamento do primeiro pedido.
 */
export async function placeOrder(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/checkout");

  const fulfillmentType = (formData.get("fulfillmentType") as FulfillmentType) || "DELIVERY";
  const paymentMethod = (formData.get("paymentMethod") as PaymentMethod) || "PIX";
  const addressId = (formData.get("addressId") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: true,
          product: {
            include: { store: { include: { settings: true } } },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) redirect("/cart");

  const address =
    fulfillmentType === "DELIVERY" && addressId
      ? await prisma.address.findUnique({ where: { id: addressId } })
      : null;

  // Agrupa itens por loja.
  const byStore = new Map<string, typeof cart.items>();
  for (const item of cart.items) {
    const sid = item.product.storeId;
    if (!byStore.has(sid)) byStore.set(sid, []);
    byStore.get(sid)!.push(item);
  }

  const createdCodes: string[] = [];

  for (const [storeId, items] of byStore) {
    const store = items[0].product.store;
    const settings = store.settings;
    const subtotal = items.reduce(
      (s, i) => s + toNumber(i.unitPrice) * i.quantity,
      0,
    );

    // Frete
    let distanceKm = 0;
    let deliveryFee = 0;
    if (fulfillmentType === "DELIVERY") {
      if (address?.lat && address?.lng && store.lat && store.lng) {
        distanceKm = haversineKm(store.lat, store.lng, address.lat, address.lng);
      }
      deliveryFee = calcDeliveryFee({
        distanceKm,
        base: toNumber(settings?.deliveryFeeBase ?? 0),
        perKm: toNumber(settings?.deliveryFeePerKm ?? 0),
        subtotal,
        freeThreshold: settings?.freeDeliveryThreshold
          ? toNumber(settings.freeDeliveryThreshold)
          : null,
      });
    }

    // Cashback (se a loja tiver regra ativa)
    let cashbackEarned = 0;
    let cashbackPercent = 0;
    const rule =
      settings?.cashbackEnabled === true
        ? await prisma.cashbackRule.findFirst({
            where: { storeId, active: true },
            orderBy: { createdAt: "desc" },
          })
        : null;
    if (rule && subtotal >= toNumber(rule.minOrderValue)) {
      cashbackEarned = calcCashback({
        type: rule.type,
        value: toNumber(rule.value),
        subtotal,
        maxValue: rule.maxValue ? toNumber(rule.maxValue) : null,
      });
      cashbackPercent = rule.type === "PERCENT" ? toNumber(rule.value) : 0;
    }

    const total = subtotal + deliveryFee;
    const code = generateOrderCode();

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          code,
          customerId: user.id,
          storeId,
          status: "PENDING",
          fulfillmentType,
          subtotal,
          deliveryFee,
          total,
          cashbackEarned,
          addressId: fulfillmentType === "DELIVERY" ? addressId : null,
          notes,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              name: i.product.name,
              unitPrice: toNumber(i.unitPrice),
              quantity: i.quantity,
              total: toNumber(i.unitPrice) * i.quantity,
              cashbackPercent,
            })),
          },
          payment: {
            create: {
              method: paymentMethod,
              status: "PENDING",
              amount: total,
            },
          },
          statusHistory: {
            create: {
              status: "PENDING",
              note: "Pedido realizado pelo cliente.",
              createdById: user.id,
            },
          },
          ...(fulfillmentType === "DELIVERY"
            ? {
                delivery: {
                  create: {
                    status: "PENDING",
                    fee: deliveryFee,
                    distanceKm,
                    estimatedMinutes: estimateMinutes(
                      distanceKm,
                      settings?.prepTimeMinutes ?? 20,
                    ),
                    courierEarnings: Math.round(deliveryFee * 0.8 * 100) / 100,
                    platformFee: Math.round(deliveryFee * 0.2 * 100) / 100,
                    pickupLat: store.lat,
                    pickupLng: store.lng,
                    dropoffLat: address?.lat,
                    dropoffLng: address?.lng,
                  },
                },
              }
            : {}),
        },
      });

      // Cashback pendente
      if (cashbackEarned > 0 && rule) {
        await tx.cashbackTransaction.create({
          data: {
            userId: user.id,
            storeId,
            orderId: order.id,
            ruleId: rule.id,
            type: "EARNED",
            status: "PENDING",
            amount: cashbackEarned,
            availableAt: cashbackReleaseDate(new Date(), rule.releaseAfterDays),
            expiresAt: cashbackExpiryDate(new Date(), rule.validityDays),
          },
        });
      }

      // Baixa de estoque + movimentação
      for (const i of items) {
        if (i.variantId) {
          await tx.productVariant.update({
            where: { id: i.variantId },
            data: { stock: { decrement: i.quantity } },
          });
        } else if (i.product.manageStock) {
          await tx.product.update({
            where: { id: i.productId },
            data: {
              stock: { decrement: i.quantity },
              salesCount: { increment: i.quantity },
            },
          });
        }
        await tx.stockMovement.create({
          data: {
            storeId,
            productId: i.productId,
            variantId: i.variantId,
            type: "SALE",
            quantity: -i.quantity,
            reason: `Venda pedido ${code}`,
            reference: order.id,
            createdById: user.id,
          },
        });
      }

      // Fidelidade
      const tiers = await tx.loyaltyTier.findMany({ where: { storeId } });
      const status = await tx.loyaltyStatus.upsert({
        where: { userId_storeId: { userId: user.id, storeId } },
        update: {
          totalOrders: { increment: 1 },
          totalSpend: { increment: total },
        },
        create: {
          userId: user.id,
          storeId,
          totalOrders: 1,
          totalSpend: total,
        },
      });
      if (tiers.length > 0) {
        const tier = resolveTier(
          tiers.map((t) => ({
            id: t.id,
            name: t.name,
            level: t.level,
            minOrders: t.minOrders,
            minSpend: toNumber(t.minSpend),
          })),
          {
            totalOrders: status.totalOrders,
            totalSpend: toNumber(status.totalSpend),
          },
        );
        if (tier && tier.id !== status.tierId) {
          await tx.loyaltyStatus.update({
            where: { id: status.id },
            data: { tierId: tier.id },
          });
        }
      }

      // Notifica a loja
      await tx.notification.create({
        data: {
          userId: store.ownerId,
          type: "ORDER",
          title: "Novo pedido recebido",
          body: `Pedido ${code} • ${items.length} item(ns)`,
          data: { orderId: order.id, code },
        },
      });
    });

    createdCodes.push(code);
  }

  // Limpa o carrinho
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  revalidatePath("/cart");
  revalidatePath("/account/orders");

  redirect(`/orders/${createdCodes[0]}`);
}

/** Atualiza o status de um pedido (painel da loja). */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { store: { select: { ownerId: true } } },
  });
  if (!order) return;

  // Apenas admin ou dono da loja podem alterar.
  if (user.role !== "ADMIN" && order.store.ownerId !== user.id) return;

  const timestamps: Partial<Record<string, Date>> = {};
  if (status === "ACCEPTED") timestamps.acceptedAt = new Date();
  if (status === "READY") timestamps.readyAt = new Date();
  if (status === "DELIVERED") timestamps.deliveredAt = new Date();
  if (status === "CANCELLED") timestamps.cancelledAt = new Date();

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...timestamps,
      statusHistory: {
        create: { status, createdById: user.id },
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: order.customerId,
      type: "ORDER",
      title: "Atualização do seu pedido",
      body: `Pedido ${order.code} agora está: ${status}`,
      data: { orderId, code: order.code },
    },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath(`/orders/${order.code}`);
}
