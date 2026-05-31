import Link from "next/link";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Clock,
  DollarSign,
  Flag,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminStats } from "@/services/stats";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS, STORE_STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const [pendingStores, recentOrders] = await Promise.all([
    safeQuery(
      () =>
        prisma.store.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { owner: { select: { name: true } } },
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            store: { select: { name: true } },
            customer: { select: { name: true } },
          },
        }),
      [],
    ),
  ]);

  return (
    <>
      <PageHeader
        title="Visão geral da plataforma"
        description="Métricas e atividades de toda a ComerziaHub."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuários" value={stats.users} icon={Users} accent="brand" />
        <StatCard label="Lojas" value={stats.stores} icon={Store} accent="sky" />
        <StatCard label="Produtos" value={stats.products} icon={Package} accent="emerald" />
        <StatCard label="Pedidos" value={stats.orders} icon={ShoppingCart} accent="amber" />
        <StatCard label="Em andamento" value={stats.inProgress} icon={Clock} accent="sky" />
        <StatCard
          label="Faturamento"
          value={formatCurrency(stats.revenue)}
          icon={DollarSign}
          accent="emerald"
          hint="Pedidos entregues/concluídos"
        />
        <StatCard label="Lojas pendentes" value={stats.pendingStores} icon={AlertCircle} accent="amber" />
        <StatCard label="Denúncias" value={stats.reports} icon={Flag} accent="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Lojas aguardando aprovação</h2>
            <Link href="/admin/stores" className="text-sm text-brand-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {pendingStores.length === 0 && (
              <p className="text-sm text-slate-500">Nenhuma loja pendente. 🎉</p>
            )}
            {pendingStores.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400">por {s.owner.name}</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">{STORE_STATUS_LABELS[s.status]}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Pedidos recentes</h2>
            <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentOrders.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum pedido ainda.</p>
            )}
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-800">{o.code}</p>
                  <p className="text-xs text-slate-400">
                    {o.store.name} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={ORDER_STATUS[o.status].className}>{ORDER_STATUS[o.status].label}</Badge>
                  <p className="mt-0.5 text-xs font-medium text-slate-600">{formatCurrency(o.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
