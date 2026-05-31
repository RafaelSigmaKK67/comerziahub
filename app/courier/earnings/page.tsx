import { DollarSign } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency, formatDate, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CourierEarningsPage() {
  const user = await getCurrentUser();
  const courier = await safeQuery(
    () => prisma.courierProfile.findUnique({ where: { userId: user!.id } }),
    null,
  );
  const delivered = courier
    ? await safeQuery(
        () =>
          prisma.delivery.findMany({
            where: { courierId: courier.id, status: "DELIVERED" },
            orderBy: { deliveredAt: "desc" },
            include: { order: { select: { code: true } } },
          }),
        [],
      )
    : [];
  const total = delivered.reduce((s, d) => s + toNumber(d.courierEarnings), 0);

  return (
    <>
      <PageHeader title="Ganhos" description="Total recebido por entregas concluídas." />

      <Card className="mb-6 flex items-center gap-4 bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white">
        <DollarSign className="h-10 w-10" />
        <div>
          <p className="text-sm text-emerald-50">Total acumulado</p>
          <p className="text-3xl font-extrabold">{formatCurrency(total)}</p>
        </div>
      </Card>

      {delivered.length === 0 ? (
        <EmptyState icon={DollarSign} title="Nenhuma entrega concluída ainda" />
      ) : (
        <Card className="divide-y divide-slate-100">
          {delivered.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{d.order.code}</p>
                <p className="text-xs text-slate-400">
                  {d.deliveredAt ? formatDate(d.deliveredAt, true) : "—"} · {d.distanceKm} km
                </p>
              </div>
              <span className="font-semibold text-emerald-600">{formatCurrency(d.courierEarnings)}</span>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
