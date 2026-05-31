import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

export const dynamic = "force-dynamic";

const VEHICLES: Record<string, string> = {
  BIKE: "Bicicleta",
  MOTORCYCLE: "Moto",
  CAR: "Carro",
  FOOT: "A pé",
};

export default async function CourierProfilePage() {
  const user = await getCurrentUser();
  const courier = await safeQuery(
    () => prisma.courierProfile.findUnique({ where: { userId: user!.id } }),
    null,
  );

  return (
    <>
      <PageHeader title="Perfil do entregador" description="Veículo, dados de pagamento e situação." />

      {courier && (
        <Card className="mb-6 grid gap-4 p-6 sm:grid-cols-2">
          <Info label="Veículo" value={VEHICLES[courier.vehicleType] ?? courier.vehicleType} />
          <Info label="Status do cadastro" value={<Badge className="bg-brand-50 text-brand-700">{courier.status}</Badge>} />
          <Info label="Chave Pix" value={courier.pixKey || "Não informada"} />
          <Info label="Entregas realizadas" value={String(courier.deliveriesCount)} />
        </Card>
      )}

      <ComingSoon
        title="Edição de perfil e dados bancários"
        description="Atualize veículo, chave Pix e dados bancários para repasses."
        ready={["Campos vehicleType, pixKey, bankInfo em CourierProfile"]}
      />
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}
