import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import type { OrderStatus } from "@prisma/client";

export async function getOrderByCode(code: string) {
  return safeQuery(
    () =>
      prisma.order.findUnique({
        where: { code },
        include: {
          store: { select: { name: true, slug: true, logoUrl: true, phone: true } },
          customer: { select: { name: true, email: true } },
          items: true,
          payment: true,
          delivery: true,
          address: true,
          statusHistory: { orderBy: { createdAt: "asc" } },
        },
      }),
    null,
  );
}

export async function listUserOrders(userId: string) {
  return safeQuery(
    () =>
      prisma.order.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          store: { select: { name: true, slug: true, logoUrl: true } },
          items: { select: { id: true } },
        },
      }),
    [],
  );
}

export async function listStoreOrders(storeId: string, status?: OrderStatus) {
  return safeQuery(
    () =>
      prisma.order.findMany({
        where: { storeId, ...(status ? { status } : {}) },
        orderBy: { createdAt: "desc" },
        take: 80,
        include: {
          customer: { select: { name: true, image: true } },
          items: true,
          delivery: true,
        },
      }),
    [],
  );
}
