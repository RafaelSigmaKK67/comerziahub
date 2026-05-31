import { DollarSign, ShoppingCart, TrendingUp, Percent } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { getAdminStats } from "@/services/stats";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const stats = await getAdminStats();
  const avgTicket = stats.orders > 0 ? stats.revenue / stats.orders : 0;
  const estimatedFee = stats.revenue * 0.1; // taxa padrão ilustrativa de 10%

  return (
    <>
      <PageHeader title="Financeiro" description="Resumo financeiro da plataforma." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Faturamento (GMV)" value={formatCurrency(stats.revenue)} icon={DollarSign} accent="emerald" />
        <StatCard label="Pedidos" value={stats.orders} icon={ShoppingCart} accent="brand" />
        <StatCard label="Ticket médio" value={formatCurrency(avgTicket)} icon={TrendingUp} accent="sky" />
        <StatCard label="Taxa estimada (10%)" value={formatCurrency(estimatedFee)} icon={Percent} accent="amber" />
      </div>
      <Card className="mt-6 p-6 text-sm text-slate-500">
        As taxas reais por loja são definidas pelo plano (campo <code>commissionRate</code> em{" "}
        <code>Plan</code>). Relatórios detalhados, exportações e repasses entram no roadmap.
      </Card>
    </>
  );
}
