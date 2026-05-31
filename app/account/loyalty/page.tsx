import Link from "next/link";
import { Award } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountLoyaltyPage() {
  const user = await getCurrentUser();
  const [statuses, badges] = await Promise.all([
    safeQuery(
      () =>
        prisma.loyaltyStatus.findMany({
          where: { userId: user!.id },
          include: { store: { select: { name: true, slug: true } }, tier: true },
          orderBy: { totalSpend: "desc" },
        }),
      [],
    ),
    safeQuery(
      () => prisma.userBadge.findMany({ where: { userId: user!.id }, include: { badge: true } }),
      [],
    ),
  ]);

  return (
    <>
      <PageHeader title="Fidelidade" description="Seus níveis e emblemas em cada loja." />

      {statuses.length === 0 ? (
        <EmptyState icon={Award} title="Sem níveis de fidelidade ainda" description="Compre em lojas com programa de fidelidade para evoluir." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statuses.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-center justify-between">
                <Link href={`/store/${s.store.slug}`} className="font-semibold text-slate-900 hover:text-brand-600">
                  {s.store.name}
                </Link>
                {s.tier ? (
                  <Badge style={{ backgroundColor: `${s.tier.color}22`, color: s.tier.color ?? undefined }}>
                    <Award className="h-3 w-3" /> {s.tier.name}
                  </Badge>
                ) : (
                  <Badge className="bg-slate-100 text-slate-500">Iniciante</Badge>
                )}
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-500">
                <span>{s.totalOrders} pedidos</span>
                <span>{formatCurrency(s.totalSpend)} gastos</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {badges.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold text-slate-900">Emblemas</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div key={b.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Award className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-medium text-slate-700">{b.badge.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
