import { FileCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function CourierDocumentsPage() {
  const user = await getCurrentUser();
  const courier = await safeQuery(
    () =>
      prisma.courierProfile.findUnique({
        where: { userId: user!.id },
        include: { documents: true },
      }),
    null,
  );

  return (
    <>
      <PageHeader title="Documentos" description="Envie seus documentos para aprovação do cadastro." />

      {courier && courier.documents.length > 0 && (
        <Card className="mb-6 divide-y divide-slate-100">
          {courier.documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileCheck className="h-4 w-4 text-brand-600" /> {d.type}
              </span>
              <Badge className={d.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}>
                {d.approved ? "Aprovado" : "Em análise"}
              </Badge>
            </div>
          ))}
        </Card>
      )}

      <ComingSoon
        title="Upload de documentos"
        description="Envio de CNH, comprovante de endereço e documento do veículo, com aprovação pelo admin."
        ready={["Modelo CourierDocument no schema", "Status de aprovação em CourierProfile"]}
      />
    </>
  );
}
