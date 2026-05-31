import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await safeQuery(
    () =>
      prisma.plan.findMany({
        orderBy: { price: "asc" },
        include: { _count: { select: { subscriptions: true } } },
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Planos" description="Planos de assinatura das lojas e taxas da plataforma." />
      {plans.length === 0 ? (
        <EmptyState icon={CreditCard} title="Nenhum plano cadastrado" description="Rode o seed para criar planos de exemplo." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                {p.active && <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>}
              </div>
              <p className="mt-2 text-2xl font-extrabold text-brand-600">
                {formatCurrency(p.price)}
                <span className="text-sm font-medium text-slate-400">/{p.interval === "MONTHLY" ? "mês" : "ano"}</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Taxa da plataforma: <strong>{p.commissionRate.toString()}%</strong>
              </p>
              <p className="mt-1 text-sm text-slate-500">{p._count.subscriptions} loja(s) assinante(s)</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
