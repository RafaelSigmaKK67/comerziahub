import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

/** Loja gerenciada pelo usuário: própria (owner) ou via vínculo (funcionário). */
export async function getManagedStore(userId: string) {
  return safeQuery(async () => {
    const owned = await prisma.store.findFirst({
      where: { ownerId: userId },
      include: {
        settings: true,
        _count: { select: { products: true, orders: true, followers: true } },
      },
    });
    if (owned) return owned;

    const member = await prisma.storeMember.findFirst({
      where: { userId, active: true },
      include: {
        store: {
          include: {
            settings: true,
            _count: { select: { products: true, orders: true, followers: true } },
          },
        },
      },
    });
    return member?.store ?? null;
  }, null);
}

export async function listStoreProducts(storeId: string) {
  return safeQuery(
    () =>
      prisma.product.findMany({
        where: { storeId },
        orderBy: { createdAt: "desc" },
        include: {
          images: { take: 1, orderBy: { position: "asc" } },
          _count: { select: { variants: true } },
        },
      }),
    [],
  );
}

export async function getStoreCustomers(storeId: string) {
  return safeQuery(
    () =>
      prisma.loyaltyStatus.findMany({
        where: { storeId },
        orderBy: { totalSpend: "desc" },
        take: 50,
        include: {
          user: { select: { name: true, email: true, image: true } },
          tier: true,
        },
      }),
    [],
  );
}
