import { Store as StoreIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatDate } from "@/lib/utils";
import { STORE_STATUS_LABELS } from "@/lib/constants";
import { setStoreStatus, deleteStore, updateStore } from "@/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-slate-200 text-slate-600",
  SUSPENDED: "bg-rose-100 text-rose-700",
};

export default async function AdminStoresPage() {
  const stores = await safeQuery(
    () =>
      prisma.store.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          owner: { select: { name: true, email: true } },
          _count: { select: { products: true, orders: true } },
        },
      }),
    [],
  );

  return (
    <>
      <PageHeader title="Lojas" description="Aprovação e moderação de lojas da plataforma." />

      {stores.length === 0 ? (
        <EmptyState icon={StoreIcon} title="Nenhuma loja cadastrada" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Loja</th>
                  <th className="px-4 py-3">Dono</th>
                  <th className="px-4 py-3">Produtos</th>
                  <th className="px-4 py-3">Pedidos</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">/{s.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.owner.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s._count.products}</td>
                    <td className="px-4 py-3 text-slate-600">{s._count.orders}</td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_STYLE[s.status]}>{STORE_STATUS_LABELS[s.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <details>
                        <summary className="cursor-pointer list-none text-sm font-medium text-brand-600 hover:underline">
                          Editar
                        </summary>
                        <form
                          action={updateStore.bind(null, s.id)}
                          className="mt-3 grid w-72 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                        >
                          <label className="label-base" htmlFor={`s-nome-${s.id}`}>Nome</label>
                          <input id={`s-nome-${s.id}`} name="name" defaultValue={s.name} className="input-base" />
                          <label className="label-base" htmlFor={`s-seg-${s.id}`}>Segmento</label>
                          <input id={`s-seg-${s.id}`} name="segment" defaultValue={s.segment ?? ""} className="input-base" placeholder="Ex.: Mercado" />
                          <label className="label-base" htmlFor={`s-status-${s.id}`}>Status</label>
                          <select id={`s-status-${s.id}`} name="status" defaultValue={s.status} className="input-base">
                            {Object.entries(STORE_STATUS_LABELS).map(([v, l]) => (
                              <option key={v} value={v}>{l}</option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" name="isOpen" defaultChecked={s.isOpen} /> Loja aberta
                          </label>
                          <Button size="sm" type="submit">Salvar</Button>
                        </form>
                      </details>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {s.status !== "ACTIVE" && (
                          <form action={setStoreStatus.bind(null, s.id, "ACTIVE")}>
                            <Button size="sm" type="submit">Aprovar</Button>
                          </form>
                        )}
                        {s.status === "ACTIVE" && (
                          <form action={setStoreStatus.bind(null, s.id, "SUSPENDED")}>
                            <Button size="sm" variant="outline" type="submit">Suspender</Button>
                          </form>
                        )}
                        <form action={deleteStore.bind(null, s.id)}>
                          <Button size="sm" variant="danger" type="submit">Excluir</Button>
                        </form>
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
