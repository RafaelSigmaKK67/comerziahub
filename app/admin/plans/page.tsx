import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency, toNumber } from "@/lib/utils";
import { createPlan, updatePlan, deletePlan } from "@/actions/admin";

export const dynamic = "force-dynamic";

function PlanFields({
  prefix,
  plan,
}: {
  prefix: string;
  plan?: {
    name: string;
    description: string | null;
    price: Parameters<typeof toNumber>[0];
    interval: string;
    commissionRate: Parameters<typeof toNumber>[0];
    maxProducts: number | null;
    active: boolean;
  };
}) {
  return (
    <>
      <div>
        <label className="label-base" htmlFor={`${prefix}-nome`}>Nome</label>
        <input id={`${prefix}-nome`} name="name" required defaultValue={plan?.name ?? ""} className="input-base w-36" placeholder="PRO" />
      </div>
      <div>
        <label className="label-base" htmlFor={`${prefix}-preco`}>Preço (R$)</label>
        <input id={`${prefix}-preco`} name="price" type="number" step="0.01" min={0} defaultValue={plan ? toNumber(plan.price) : ""} className="input-base w-28" />
      </div>
      <div>
        <label className="label-base" htmlFor={`${prefix}-intervalo`}>Cobrança</label>
        <select id={`${prefix}-intervalo`} name="interval" defaultValue={plan?.interval ?? "MONTHLY"} className="input-base w-32">
          <option value="MONTHLY">Mensal</option>
          <option value="YEARLY">Anual</option>
        </select>
      </div>
      <div>
        <label className="label-base" htmlFor={`${prefix}-comissao`}>Comissão (%)</label>
        <input id={`${prefix}-comissao`} name="commissionRate" type="number" step="0.01" min={0} max={100} defaultValue={plan ? toNumber(plan.commissionRate) : ""} className="input-base w-28" />
      </div>
      <div>
        <label className="label-base" htmlFor={`${prefix}-max`}>Máx. produtos</label>
        <input id={`${prefix}-max`} name="maxProducts" type="number" min={0} defaultValue={plan?.maxProducts ?? ""} className="input-base w-28" placeholder="∞" />
      </div>
      <div className="w-full">
        <label className="label-base" htmlFor={`${prefix}-desc`}>Descrição</label>
        <input id={`${prefix}-desc`} name="description" defaultValue={plan?.description ?? ""} className="input-base" placeholder="Para lojas em crescimento" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" defaultChecked={plan?.active ?? true} /> Plano ativo
      </label>
    </>
  );
}

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
      <PageHeader
        title="Planos"
        description="Crie, edite ou exclua os planos de assinatura das lojas e suas taxas."
      />

      <Card className="mb-6 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Novo plano</h2>
        <form action={createPlan} className="flex flex-wrap items-end gap-3">
          <PlanFields prefix="novo-plano" />
          <Button type="submit">Criar plano</Button>
        </form>
      </Card>

      {plans.length === 0 ? (
        <EmptyState icon={CreditCard} title="Nenhum plano cadastrado" description="Crie o primeiro plano acima." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                {p.active ? (
                  <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
                ) : (
                  <Badge className="bg-slate-200 text-slate-600">Inativo</Badge>
                )}
              </div>
              <p className="mt-2 text-2xl font-extrabold text-brand-600">
                {formatCurrency(p.price)}
                <span className="text-sm font-medium text-slate-400">/{p.interval === "MONTHLY" ? "mês" : "ano"}</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Taxa da plataforma: <strong>{p.commissionRate.toString()}%</strong>
              </p>
              <p className="mt-1 text-sm text-slate-500">{p._count.subscriptions} loja(s) assinante(s)</p>

              <details className="mt-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-brand-600 hover:underline">
                  Editar
                </summary>
                <form
                  action={updatePlan.bind(null, p.id)}
                  className="mt-3 flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <PlanFields prefix={`plano-${p.id}`} plan={p} />
                  <Button size="sm" type="submit">Salvar</Button>
                </form>
              </details>
              <form action={deletePlan.bind(null, p.id)} className="mt-2">
                <Button size="sm" variant="danger" type="submit">Excluir</Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
