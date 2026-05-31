"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { DeliveryStatus } from "@prisma/client";

async function myCourier(userId: string) {
  return prisma.courierProfile.findUnique({ where: { userId } });
}

export async function toggleOnline(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const courier = await myCourier(user.id);
  if (!courier) return;
  await prisma.courierProfile.update({
    where: { id: courier.id },
    data: { isOnline: !courier.isOnline },
  });
  revalidatePath("/courier");
}

export async function acceptDelivery(deliveryId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const courier = await myCourier(user.id);
  if (!courier) return;

  const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });
  if (!delivery || delivery.status !== "PENDING") return;

  await prisma.delivery.update({
    where: { id: deliveryId },
    data: { courierId: courier.id, status: "ACCEPTED", acceptedAt: new Date() },
  });
  revalidatePath("/courier/deliveries");
}

export async function advanceDelivery(deliveryId: string, status: DeliveryStatus): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const courier = await myCourier(user.id);
  if (!courier) return;

  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: { order: true },
  });
  if (!delivery || delivery.courierId !== courier.id) return;

  const data: Record<string, unknown> = { status };
  if (status === "PICKED_UP") data.pickedUpAt = new Date();
  if (status === "DELIVERED") data.deliveredAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.delivery.update({ where: { id: deliveryId }, data });

    if (status === "PICKED_UP") {
      await tx.order.update({
        where: { id: delivery.orderId },
        data: {
          status: "OUT_FOR_DELIVERY",
          statusHistory: { create: { status: "OUT_FOR_DELIVERY", createdById: user.id } },
        },
      });
    }
    if (status === "DELIVERED") {
      await tx.order.update({
        where: { id: delivery.orderId },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
          statusHistory: { create: { status: "DELIVERED", createdById: user.id } },
        },
      });
      await tx.courierProfile.update({
        where: { id: courier.id },
        data: { deliveriesCount: { increment: 1 } },
      });
    }
  });

  revalidatePath("/courier/deliveries");
}
