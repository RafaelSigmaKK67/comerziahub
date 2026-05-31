import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  Users,
  DollarSign,
  Store as StoreIcon,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CreateStoreForm } from "@/components/dashboard/create-store-form";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { getStoreStats } from "@/services/stats";
import { listStoreOrders } from "@/services/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS, STORE_STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function StoreOverview() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);

  if (!store) {
    return (
      <>
        <PageHeader
          title="Crie sua loja"
          description="Você ainda não tem uma loja. Configure em segundos para começar a vender."
        />
        <Card className="max-w-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <StoreIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Dados da loja</h2>
              <p className="text-sm text-slate-500">Você poderá editar tudo depois.</p>
            </div>
          </div>
          <CreateStoreForm />
        </Card>
      </>
    );
  }

  const [stats, orders] = await Promise.all([
    getStoreStats(store.id),
    listStoreOrders(store.id),
  ]);
  const recent = orders.slice(0, 6);

  return (
    <>
      <PageHeader
        title={store.name}
        description="Resumo da sua operação."
        action={
          <div className="flex items-center gap-2">
            <Badge className="bg-brand-50 text-brand-700">{STORE_STATUS_LABELS[store.status]}</Badge>
            <Link href={`/store/${store.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Ver página pública
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aguardando aceite" value={stats.pending} icon={Clock} accent="amber" />
        <StatCard label="Em preparo" value={stats.preparing} icon={ShoppingCart} accent="sky" />
        <StatCard label="Em entrega" value={stats.delivering} icon={Truck} accent="brand" />
        <StatCard label="Concluídos" value={stats.completed} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Produtos" value={stats.products} icon={Package} accent="brand" />
        <StatCard label="Clientes" value={stats.customers} icon={Users} accent="sky" />
        <StatCard
          label="Faturamento"
          value={formatCurrency(stats.revenue)}
          icon={DollarSign}
          accent="emerald"
        />
      </div>

      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Pedidos recentes</h2>
          <Link href="/dashboard/orders" className="text-sm text-brand-600 hover:underline">
            Gerenciar pedidos
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {recent.length === 0 && <p className="text-sm text-slate-500">Nenhum pedido ainda.</p>}
          {recent.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-800">{o.code}</p>
                <p className="text-xs text-slate-400">
                  {o.customer.name} · {formatDate(o.createdAt)}
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
    </>
  );
}
