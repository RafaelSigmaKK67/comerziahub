import { redirect } from "next/navigation";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LoyaltyPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const tiers = await safeQuery(
    () => prisma.loyaltyTier.findMany({ where: { storeId: store.id }, orderBy: { level: "asc" } }),
    [],
  );

  return (
    <>
      <PageHeader title="Fidelidade" description="Níveis, emblemas e benefícios para seus clientes." />

      {tiers.length > 0 ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: t.color ?? "#7c4dff" }}>
                  <Award className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-slate-900">{t.name}</h3>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>A partir de {t.minOrders} pedidos</li>
                <li>Gasto mínimo: {formatCurrency(t.minSpend)}</li>
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-sm text-slate-500">
          Nenhum nível configurado. O seed cria níveis padrão (Bronze → VIP).
        </p>
      )}

      <ComingSoon
        title="Editor de níveis e benefícios"
        description="Defina compras/gasto por nível e benefícios (desconto, cashback extra, frete grátis, cupom, produtos exclusivos)."
        ready={["Modelos LoyaltyTier / LoyaltyStatus / Badge no schema", "Cálculo de nível aplicado a cada pedido"]}
      />
    </>
  );
}
