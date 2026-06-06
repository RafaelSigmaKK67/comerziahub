import { redirect } from "next/navigation";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  ShoppingBag,
  Package,
  Wallet,
  Receipt,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PriceSimulator } from "@/components/finance/price-simulator";
import { PaymentComparison } from "@/components/finance/payment-comparison";
import { SaleSimulator } from "@/components/finance/sale-simulator";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import {
  getStoreFinance,
  getStoreProfitByProduct,
  getStoreRecentOrdersFinance,
} from "@/services/finance";
import { formatCurrency, formatPercent, formatDate, toNumber } from "@/lib/utils";
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const user = await getCurrentUser();
  // Financeiro é restrito ao dono da loja (e ao admin).
  if (user!.role !== "STORE_OWNER" && user!.role !== "ADMIN") {
    redirect("/dashboard");
  }
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const [fin, topProducts, recent] = await Promise.all([
    getStoreFinance(store.id, 30),
    getStoreProfitByProduct(store.id, 30),
    getStoreRecentOrdersFinance(store.id),
  ]);

  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Lucro, prejuízo e simuladores — últimos 30 dias (pedidos concluídos)."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Faturamento" value={formatCurrency(fin.revenue)} icon={ShoppingBag} accent="emerald" hint={`${fin.orders} pedido(s)`} />
        <StatCard label="Custos (produtos)" value={formatCurrency(fin.cost)} icon={Package} accent="amber" />
        <StatCard label="Comissão + taxas" value={formatCurrency(fin.commission + fin.fees)} icon={Percent} accent="rose" />
        <StatCard label="Cashback concedido" value={formatCurrency(fin.cashback)} icon={Wallet} accent="sky" />
        <StatCard
          label={fin.net < 0 ? "Prejuízo líquido" : "Lucro líquido"}
          value={formatCurrency(fin.net)}
          icon={fin.net < 0 ? TrendingDown : TrendingUp}
          accent={fin.net < 0 ? "rose" : "emerald"}
        />
        <StatCard label="Margem líquida" value={formatPercent(fin.margin)} icon={Percent} accent="brand" />
        <StatCard label="Ticket médio" value={formatCurrency(fin.ticket)} icon={Receipt} accent="sky" />
        <StatCard label="Saídas totais" value={formatCurrency(fin.expenses)} icon={DollarSign} accent="amber" hint="custos + comissão + taxas + cashback" />
      </div>

      {/* Entrou x Saiu */}
      <Card className="mt-6 p-6">
        <h2 className="font-semibold text-slate-900">Entrou × Saiu</h2>
        <div className="mt-3 space-y-3 text-sm">
          <Bar label="Entrou (faturamento)" value={fin.revenue} max={Math.max(fin.revenue, fin.expenses, 1)} color="bg-emerald-500" amount={formatCurrency(fin.revenue)} />
          <Bar label="Saiu (custos + taxas + cashback)" value={fin.expenses} max={Math.max(fin.revenue, fin.expenses, 1)} color="bg-rose-500" amount={formatCurrency(fin.expenses)} />
          <div className="flex justify-between border-t border-slate-100 pt-3 font-semibold text-slate-900">
            <span>Resultado</span>
            <span className={fin.net < 0 ? "text-rose-600" : "text-emerald-600"}>{formatCurrency(fin.net)}</span>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Lucro por produto */}
        <Card className="p-5">
          <h2 className="font-semibold text-slate-900">Lucro por produto</h2>
          {topProducts.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Sem vendas concluídas no período.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-3">Produto</th>
                    <th className="py-2 pr-3 text-right">Receita</th>
                    <th className="py-2 text-right">Lucro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-3 text-slate-700">{p.name}</td>
                      <td className="py-2 pr-3 text-right text-slate-600">{formatCurrency(p.revenue)}</td>
                      <td className={`py-2 text-right font-medium ${p.profit < 0 ? "text-rose-600" : "text-emerald-600"}`}>{formatCurrency(p.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pedidos recentes com lucro */}
        <Card className="p-5">
          <h2 className="font-semibold text-slate-900">Pedidos recentes</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Nenhum pedido ainda.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{o.code}</p>
                    <p className="text-xs text-slate-400">
                      {o.payment ? PAYMENT_METHOD_LABELS[o.payment.method] : "—"} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={ORDER_STATUS[o.status].className}>{ORDER_STATUS[o.status].label}</Badge>
                    <p className={`mt-0.5 text-xs font-medium ${toNumber(o.netProfit) < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      lucro {formatCurrency(o.netProfit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Ferramentas / simuladores */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-900">Ferramentas de simulação</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <PriceSimulator />
        <PaymentComparison />
        <div className="lg:col-span-2">
          <SaleSimulator />
        </div>
      </div>
    </>
  );
}

function Bar({
  label,
  value,
  max,
  color,
  amount,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  amount: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">{amount}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
