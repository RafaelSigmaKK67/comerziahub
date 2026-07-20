import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { EditDialog } from "@/components/admin/edit-dialog";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import { setUserStatus, deleteUser, createUser, updateUser } from "@/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-800",
  SUSPENDED: "bg-rose-100 text-rose-700",
  BANNED: "bg-slate-800 text-white",
};

const ROLE_OPTIONS = ["ADMIN", "MODERATOR", "STORE_OWNER", "SELLER", "COURIER", "CUSTOMER"] as const;

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
      <PageHeader
        title="Usuários"
        description="Crie, edite, suspenda ou exclua qualquer perfil da plataforma."
        action={
          <EditDialog trigger="Novo usuário" title="Novo usuário" variant="primary" size="md">
            <form action={createUser} className="grid gap-3">
              <div>
                <label className="label-base" htmlFor="novo-nome">Nome</label>
                <input id="novo-nome" name="name" required className="input-base" placeholder="Nome completo" />
              </div>
              <div>
                <label className="label-base" htmlFor="novo-email">E-mail</label>
                <input id="novo-email" name="email" type="email" required className="input-base" placeholder="email@exemplo.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-base" htmlFor="novo-senha">Senha (mín. 6)</label>
                  <input id="novo-senha" name="password" type="password" required minLength={6} className="input-base" />
                </div>
                <div>
                  <label className="label-base" htmlFor="novo-papel">Papel</label>
                  <select id="novo-papel" name="role" defaultValue="CUSTOMER" className="input-base">
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit">Criar usuário</Button>
            </form>
          </EditDialog>
        }
      />

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
                      <div className="flex flex-wrap items-center gap-2">
                        <EditDialog title={`Editar usuário — ${u.name}`}>
                          <form action={updateUser.bind(null, u.id)} className="grid gap-3">
                            <div>
                              <label className="label-base" htmlFor={`u-nome-${u.id}`}>Nome</label>
                              <input id={`u-nome-${u.id}`} name="name" defaultValue={u.name} className="input-base" />
                            </div>
                            <div>
                              <label className="label-base" htmlFor={`u-email-${u.id}`}>E-mail</label>
                              <input id={`u-email-${u.id}`} name="email" type="email" defaultValue={u.email} className="input-base" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="label-base" htmlFor={`u-papel-${u.id}`}>Papel</label>
                                <select id={`u-papel-${u.id}`} name="role" defaultValue={u.role} className="input-base">
                                  {ROLE_OPTIONS.map((r) => (
                                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="label-base" htmlFor={`u-senha-${u.id}`}>Nova senha</label>
                                <input id={`u-senha-${u.id}`} name="password" type="password" minLength={6} className="input-base" placeholder="em branco = manter" />
                              </div>
                            </div>
                            <Button type="submit">Salvar alterações</Button>
                          </form>
                        </EditDialog>
                        {u.role !== "ADMIN" && (
                          <>
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
                          </>
                        )}
                      </div>
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
