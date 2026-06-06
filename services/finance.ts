import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { toNumber } from "@/lib/utils";

const round = (n: number) => Math.round(n * 100) / 100;
const COMPLETED = ["DELIVERED", "COMPLETED"] as const;

export type StoreFinanceSummary = {
  days: number;
  orders: number;
  revenue: number;
  cost: number;
  commission: number;
  fees: number;
  cashback: number;
  expenses: number;
  net: number;
  margin: number;
  ticket: number;
};

/** Resumo financeiro da loja (pedidos entregues/concluídos no período). */
export async function getStoreFinance(storeId: string, days = 30): Promise<StoreFinanceSummary> {
  return safeQuery(
    async () => {
      const since = new Date(Date.now() - days * 86400000);
      const where = { storeId, status: { in: [...COMPLETED] }, createdAt: { gte: since } };
      const agg = await prisma.order.aggregate({
        where,
        _sum: {
          subtotal: true,
          costTotal: true,
          commissionFee: true,
          paymentFee: true,
          cashbackEarned: true,
          netProfit: true,
        },
        _count: true,
      });
      const s = agg._sum;
      const revenue = toNumber(s.subtotal);
      const cost = toNumber(s.costTotal);
      const commission = toNumber(s.commissionFee);
      const fees = toNumber(s.paymentFee);
      const cashback = toNumber(s.cashbackEarned);
      const net = toNumber(s.netProfit);
      const orders = agg._count;
      return {
        days,
        orders,
        revenue,
        cost,
        commission,
        fees,
        cashback,
        expenses: round(cost + commission + fees + cashback),
        net,
        margin: revenue > 0 ? round((net / revenue) * 100) : 0,
        ticket: orders > 0 ? round(revenue / orders) : 0,
      };
    },
    {
      days,
      orders: 0,
      revenue: 0,
      cost: 0,
      commission: 0,
      fees: 0,
      cashback: 0,
      expenses: 0,
      net: 0,
      margin: 0,
      ticket: 0,
    },
  );
}

/** Lucro por produto (top N), a partir dos itens de pedidos concluídos. */
export async function getStoreProfitByProduct(storeId: string, days = 30, limit = 8) {
  return safeQuery(async () => {
    const since = new Date(Date.now() - days * 86400000);
    const items = await prisma.orderItem.findMany({
      where: {
        order: { storeId, status: { in: [...COMPLETED] }, createdAt: { gte: since } },
      },
      select: { name: true, productId: true, total: true, costPrice: true, quantity: true },
    });
    const map = new Map<string, { name: string; revenue: number; profit: number; qty: number }>();
    for (const it of items) {
      const key = it.productId ?? it.name;
      const revenue = toNumber(it.total);
      const profit = revenue - toNumber(it.costPrice) * toNumber(it.quantity);
      const cur = map.get(key) ?? { name: it.name, revenue: 0, profit: 0, qty: 0 };
      cur.revenue += revenue;
      cur.profit += profit;
      cur.qty += toNumber(it.quantity);
      map.set(key, cur);
    }
    return [...map.values()]
      .map((p) => ({ ...p, revenue: round(p.revenue), profit: round(p.profit) }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, limit);
  }, []);
}

/** Pedidos recentes com lucro líquido (para a tabela do financeiro). */
export async function getStoreRecentOrdersFinance(storeId: string, take = 8) {
  return safeQuery(
    () =>
      prisma.order.findMany({
        where: { storeId },
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          code: true,
          status: true,
          total: true,
          netProfit: true,
          costTotal: true,
          createdAt: true,
          payment: { select: { method: true } },
        },
      }),
    [],
  );
}
