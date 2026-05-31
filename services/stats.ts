import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { toNumber } from "@/lib/utils";

export async function getAdminStats() {
  return safeQuery(
    async () => {
      const [users, stores, products, orders, pendingStores, reports, revenue] =
        await Promise.all([
          prisma.user.count(),
          prisma.store.count(),
          prisma.product.count(),
          prisma.order.count(),
          prisma.store.count({ where: { status: "PENDING" } }),
          prisma.report.count({ where: { status: "PENDING" } }),
          prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { in: ["DELIVERED", "COMPLETED"] } },
          }),
        ]);
      const inProgress = await prisma.order.count({
        where: { status: { in: ["ACCEPTED", "PREPARING", "READY", "OUT_FOR_DELIVERY"] } },
      });
      return {
        users,
        stores,
        products,
        orders,
        pendingStores,
        reports,
        inProgress,
        revenue: toNumber(revenue._sum.total),
      };
    },
    {
      users: 0,
      stores: 0,
      products: 0,
      orders: 0,
      pendingStores: 0,
      reports: 0,
      inProgress: 0,
      revenue: 0,
    },
  );
}

export async function getStoreStats(storeId: string) {
  return safeQuery(
    async () => {
      const [products, pending, preparing, delivering, completed, customers, revenue] =
        await Promise.all([
          prisma.product.count({ where: { storeId } }),
          prisma.order.count({ where: { storeId, status: "PENDING" } }),
          prisma.order.count({ where: { storeId, status: { in: ["ACCEPTED", "PREPARING"] } } }),
          prisma.order.count({ where: { storeId, status: "OUT_FOR_DELIVERY" } }),
          prisma.order.count({ where: { storeId, status: { in: ["DELIVERED", "COMPLETED"] } } }),
          prisma.loyaltyStatus.count({ where: { storeId } }),
          prisma.order.aggregate({
            _sum: { total: true },
            where: { storeId, status: { in: ["DELIVERED", "COMPLETED"] } },
          }),
        ]);
      return {
        products,
        pending,
        preparing,
        delivering,
        completed,
        customers,
        revenue: toNumber(revenue._sum.total),
      };
    },
    { products: 0, pending: 0, preparing: 0, delivering: 0, completed: 0, customers: 0, revenue: 0 },
  );
}

export async function getCourierStats(courierId: string) {
  return safeQuery(
    async () => {
      const [available, active, done, earnings] = await Promise.all([
        prisma.delivery.count({ where: { status: "PENDING" } }),
        prisma.delivery.count({
          where: { courierId, status: { in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] } },
        }),
        prisma.delivery.count({ where: { courierId, status: "DELIVERED" } }),
        prisma.delivery.aggregate({
          _sum: { courierEarnings: true },
          where: { courierId, status: "DELIVERED" },
        }),
      ]);
      return {
        available,
        active,
        done,
        earnings: toNumber(earnings._sum.courierEarnings),
      };
    },
    { available: 0, active: 0, done: 0, earnings: 0 },
  );
}

export async function getCustomerStats(userId: string) {
  return safeQuery(
    async () => {
      const [orders, favorites, cashback, following] = await Promise.all([
        prisma.order.count({ where: { customerId: userId } }),
        prisma.productFavorite.count({ where: { userId } }),
        prisma.cashbackWallet.aggregate({ _sum: { balance: true }, where: { userId } }),
        prisma.storeFollow.count({ where: { userId } }),
      ]);
      return {
        orders,
        favorites,
        following,
        cashback: toNumber(cashback._sum.balance),
      };
    },
    { orders: 0, favorites: 0, following: 0, cashback: 0 },
  );
}
