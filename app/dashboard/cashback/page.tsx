import { redirect } from "next/navigation";
import { Gift } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { CashbackForm } from "@/components/dashboard/cashback-form";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { toNumber } from "@/lib/utils";
import { isStoreOwner } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function CashbackPage() {
  const user = await getCurrentUser();
  if (!isStoreOwner(user!.role)) redirect("/dashboard");
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const rule = await safeQuery(
    () => prisma.cashbackRule.findFirst({ where: { storeId: store.id, active: true }, orderBy: { createdAt: "desc" } }),
    null,
  );

  return (
    <>
      <PageHeader
        title="Cashback"
        description="Configure a regra de cashback da sua loja. Ela é aplicada automaticamente nos pedidos."
      />
      <Card className="max-w-2xl p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-900">Campanha de cashback</h2>
            <p className="text-sm text-slate-500">
              {rule ? "Você tem uma campanha ativa. Salvar substitui a atual." : "Nenhuma campanha ativa."}
            </p>
          </div>
        </div>
        <CashbackForm
          current={
            rule
              ? {
                  name: rule.name,
                  type: rule.type,
                  value: toNumber(rule.value),
                  minOrderValue: toNumber(rule.minOrderValue),
                  releaseAfterDays: rule.releaseAfterDays,
                  validityDays: rule.validityDays,
                  excludePromoProducts: rule.excludePromoProducts,
                }
              : null
          }
        />
      </Card>
    </>
  );
}
