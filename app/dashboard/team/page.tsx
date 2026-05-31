import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ComingSoon } from "@/components/dashboard/coming-soon";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const members = await safeQuery(
    () =>
      prisma.storeMember.findMany({
        where: { storeId: store.id },
        include: { user: { select: { name: true, email: true, image: true } } },
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Funcionários" description="Equipe com acesso ao painel da loja." />

      {members.length > 0 && (
        <Card className="mb-6 divide-y divide-slate-100">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar src={m.user.image} name={m.user.name} size={36} />
                <div>
                  <p className="font-medium text-slate-800">{m.user.name}</p>
                  <p className="text-xs text-slate-400">{m.user.email}</p>
                </div>
              </div>
              <Badge className="bg-brand-50 text-brand-700">{m.role}</Badge>
            </div>
          ))}
        </Card>
      )}

      <ComingSoon
        title="Convidar e gerenciar funcionários"
        description="Convide membros por e-mail e defina papéis (gerente, atendente, vendedor)."
        ready={["Modelo StoreMember com papéis no schema"]}
      />
    </>
  );
}
