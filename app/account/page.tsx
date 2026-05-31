import Link from "next/link";
import { ShoppingCart, Heart, Wallet, Store } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/session";
import { getCustomerStats } from "@/services/stats";
import { listUserOrders } from "@/services/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AccountOverview() {
  const user = await getCurrentUser();
  const [stats, orders] = await Promise.all([
    getCustomerStats(user!.id),
    listUserOrders(user!.id),
  ]);
  const recent = orders.slice(0, 5);

  return (
    <>
      <PageHeader title={`Olá, ${user!.name?.split(" ")[0]}`} description="Seu resumo na ComerziaHub." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pedidos" value={stats.orders} icon={ShoppingCart} accent="brand" />
        <StatCard label="Favoritos" value={stats.favorites} icon={Heart} accent="rose" />
        <StatCard label="Lojas seguidas" value={stats.following} icon={Store} accent="sky" />
        <StatCard label="Cashback" value={formatCurrency(stats.cashback)} icon={Wallet} accent="emerald" />
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Pedidos recentes</h2>
          <Link href="/account/orders" className="text-sm text-brand-600 hover:underline">Ver todos</Link>
        </div>
        <div className="mt-4 space-y-2">
          {recent.length === 0 && <p className="text-sm text-slate-500">Você ainda não fez pedidos.</p>}
          {recent.map((o) => (
            <Link key={o.id} href={`/orders/${o.code}`} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 hover:border-brand-200">
              <div>
                <p className="text-sm font-medium text-slate-800">{o.code}</p>
                <p className="text-xs text-slate-400">{o.store.name} · {formatDate(o.createdAt)}</p>
              </div>
              <div className="text-right">
                <Badge className={ORDER_STATUS[o.status].className}>{ORDER_STATUS[o.status].label}</Badge>
                <p className="mt-0.5 text-xs font-medium text-slate-600">{formatCurrency(o.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}
