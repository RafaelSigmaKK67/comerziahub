import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import { setUserStatus, deleteUser } from "@/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-800",
  SUSPENDED: "bg-rose-100 text-rose-700",
  BANNED: "bg-slate-800 text-white",
};

export default async function AdminUsersPage() {
  const users = await safeQuery(
    () =>
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Usuários" description="Todos os perfis cadastrados na plataforma." />

      {users.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum usuário cadastrado" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Papel</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.image} name={u.name} size={34} />
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-brand-50 text-brand-700">{ROLE_LABELS[u.role]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_STYLE[u.status]}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== "ADMIN" && (
                        <div className="flex flex-wrap gap-2">
                          {u.status === "ACTIVE" ? (
                            <form action={setUserStatus.bind(null, u.id, "SUSPENDED")}>
                              <Button size="sm" variant="outline" type="submit">Suspender</Button>
                            </form>
                          ) : (
                            <form action={setUserStatus.bind(null, u.id, "ACTIVE")}>
                              <Button size="sm" type="submit">Reativar</Button>
                            </form>
                          )}
                          <form action={deleteUser.bind(null, u.id)}>
                            <Button size="sm" variant="danger" type="submit">Excluir</Button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
