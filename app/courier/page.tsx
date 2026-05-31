import Link from "next/link";
import { Truck, Package, CheckCircle2, DollarSign, Circle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/session";
import { getCourierStats } from "@/services/stats";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency } from "@/lib/utils";
import { toggleOnline } from "@/actions/courier";

export const dynamic = "force-dynamic";

export default async function CourierOverview() {
  const user = await getCurrentUser();
  const courier = await safeQuery(
    () => prisma.courierProfile.findUnique({ where: { userId: user!.id } }),
    null,
  );
  const stats = courier
    ? await getCourierStats(courier.id)
    : { available: 0, active: 0, done: 0, earnings: 0 };

  return (
    <>
      <PageHeader
        title="Painel do entregador"
        description="Fique online para receber entregas."
        action={
          courier && (
            <form action={toggleOnline}>
              <Button type="submit" variant={courier.isOnline ? "outline" : "primary"}>
                <Circle className={`h-3 w-3 ${courier.isOnline ? "fill-emerald-500 text-emerald-500" : "fill-slate-300 text-slate-300"}`} />
                {courier.isOnline ? "Ficar offline" : "Ficar online"}
              </Button>
            </form>
          )
        }
      />

      {!courier && (
        <Card className="mb-6 p-6 text-sm text-slate-500">
          Seu perfil de entregador está sendo preparado. Faça logout/login se acabou de se cadastrar.
        </Card>
      )}

      {courier && courier.status !== "APPROVED" && (
        <Card className="mb-6 flex items-center justify-between p-4">
          <p className="text-sm text-slate-600">
            Status do cadastro: <Badge className="bg-amber-100 text-amber-800">{courier.status}</Badge>
          </p>
          <Link href="/courier/documents" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Enviar documentos
          </Link>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Disponíveis" value={stats.available} icon={Package} accent="amber" />
        <StatCard label="Em andamento" value={stats.active} icon={Truck} accent="brand" />
        <StatCard label="Concluídas" value={stats.done} icon={CheckCircle2} accent="emerald" />
        <StatCard label="Ganhos" value={formatCurrency(stats.earnings)} icon={DollarSign} accent="emerald" />
      </div>

      <div className="mt-6">
        <Link href="/courier/deliveries" className={buttonVariants({ variant: "primary" })}>
          Ver entregas disponíveis
        </Link>
      </div>
    </>
  );
}
