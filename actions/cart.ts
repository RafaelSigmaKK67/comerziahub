"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { effectivePrice, toNumber } from "@/lib/utils";
import type { ActionState } from "@/types";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function addToCart(input: {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH_REQUIRED" };

  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    include: { variants: true },
  });
  if (!product) return { error: "Produto não encontrado." };

  const variant = input.variantId
    ? product.variants.find((v) => v.id === input.variantId)
    : undefined;

  const { price } = effectivePrice(product);
  const unitPrice = variant?.price
    ? toNumber(variant.price)
    : price + (variant ? toNumber(variant.priceModifier) : 0);

  const cart = await getOrCreateCart(user.id);
  const minQty = toNumber(product.minQuantity) || 1;
  const qty = input.quantity && input.quantity > 0 ? input.quantity : minQty;

  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: product.id,
      variantId: input.variantId ?? null,
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: toNumber(existing.quantity) + qty, unitPrice },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        variantId: input.variantId ?? null,
        quantity: qty,
        unitPrice,
      },
    });
  }

  revalidatePath("/cart");
  return { success: true, message: "Adicionado ao carrinho." };
}

export async function updateCartItem(itemId: string, quantity: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH_REQUIRED" };

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { id: itemId, cart: { userId: user.id } },
    });
  } else {
    await prisma.cartItem.updateMany({
      where: { id: itemId, cart: { userId: user.id } },
      data: { quantity },
    });
  }
  revalidatePath("/cart");
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH_REQUIRED" };
  await prisma.cartItem.deleteMany({
    where: { id: itemId, cart: { userId: user.id } },
  });
  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  const user = await getCurrentUser();
  if (!user) return { error: "AUTH_REQUIRED" };
  await prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } });
  revalidatePath("/cart");
  return { success: true };
}
