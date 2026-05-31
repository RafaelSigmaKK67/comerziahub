import { Truck, Package } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency } from "@/lib/utils";
import { DELIVERY_STATUS } from "@/lib/constants";
import { acceptDelivery, advanceDelivery } from "@/actions/courier";

export const dynamic = "force-dynamic";

export default async function CourierDeliveriesPage() {
  const user = await getCurrentUser();
  const courier = await safeQuery(
    () => prisma.courierProfile.findUnique({ where: { userId: user!.id } }),
    null,
  );

  const [available, mine] = await Promise.all([
    safeQuery(
      () =>
        prisma.delivery.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "asc" },
          take: 30,
          include: { order: { include: { store: { select: { name: true } } } } },
        }),
      [],
    ),
    courier
      ? safeQuery(
          () =>
            prisma.delivery.findMany({
              where: { courierId: courier.id, status: { in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] } },
              include: { order: { include: { store: { select: { name: true } } } } },
            }),
          [],
        )
      : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHeader title="Entregas" description="Aceite corridas e atualize o andamento." />

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-slate-900">Minhas entregas ativas</h2>
        {mine.length === 0 ? (
          <EmptyState icon={Truck} title="Nenhuma entrega ativa" />
        ) : (
          <div className="space-y-3">
            {mine.map((d) => (
              <Card key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-slate-900">{d.order.code}</p>
                  <p className="text-xs text-slate-400">
                    {d.order.store.name} · {d.distanceKm} km · {formatCurrency(d.courierEarnings)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={DELIVERY_STATUS[d.status].className}>{DELIVERY_STATUS[d.status].label}</Badge>
                  {d.status === "ACCEPTED" && (
                    <form action={advanceDelivery.bind(null, d.id, "PICKED_UP")}>
                      <Button size="sm" type="submit">Coletei</Button>
                    </form>
                  )}
                  {(d.status === "PICKED_UP" || d.status === "IN_TRANSIT") && (
                    <form action={advanceDelivery.bind(null, d.id, "DELIVERED")}>
                      <Button size="sm" type="submit">Entreguei</Button>
                    </form>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-slate-900">Disponíveis</h2>
        {available.length === 0 ? (
          <EmptyState icon={Package} title="Nenhuma entrega disponível no momento" />
        ) : (
          <div className="space-y-3">
            {available.map((d) => (
              <Card key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-slate-900">{d.order.code}</p>
                  <p className="text-xs text-slate-400">
                    {d.order.store.name} · {d.distanceKm} km · ~{d.estimatedMinutes} min
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-emerald-600">{formatCurrency(d.courierEarnings)}</span>
                  {courier && (
                    <form action={acceptDelivery.bind(null, d.id)}>
                      <Button size="sm" type="submit">Aceitar</Button>
                    </form>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
