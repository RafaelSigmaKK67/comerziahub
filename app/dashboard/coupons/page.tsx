import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const coupons = await safeQuery(
    () => prisma.coupon.findMany({ where: { storeId: store.id }, orderBy: { createdAt: "desc" } }),
    [],
  );

  return (
    <>
      <PageHeader title="Cupons" description="Descontos e promoções da sua loja." />

      {coupons.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-sm font-bold text-white">{c.code}</span>
                <Badge className={c.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}>
                  {c.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {c.type === "PERCENT" ? `${c.value.toString()}% off` : c.type === "FREE_SHIPPING" ? "Frete grátis" : `${formatCurrency(c.value)} off`}
              </p>
              <p className="text-xs text-slate-400">Usos: {c.usageCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</p>
            </Card>
          ))}
        </div>
      )}

      <ComingSoon
        title="Criar e editar cupons"
        description="Formulário de criação de cupons (percentual, valor fixo ou frete grátis), limites de uso e validade."
        ready={["Modelos Coupon / CouponRedemption no schema"]}
      />
    </>
  );
}
