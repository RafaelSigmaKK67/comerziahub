import { Tags } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await safeQuery(
    () =>
      prisma.category.findMany({
        where: { storeId: null },
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
    [],
  );

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Categorias globais do marketplace — crie, renomeie ou exclua."
      />

      <Card className="mb-6 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Nova categoria</h2>
        <form action={createCategory} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label-base" htmlFor="nova-cat-nome">Nome</label>
            <input id="nova-cat-nome" name="name" required className="input-base w-56" placeholder="Ex.: Pet shop" />
          </div>
          <div>
            <label className="label-base" htmlFor="nova-cat-icone">Ícone (emoji, opcional)</label>
            <input id="nova-cat-icone" name="icon" className="input-base w-40" placeholder="🐶" />
          </div>
          <Button type="submit">Criar categoria</Button>
        </form>
      </Card>

      {categories.length === 0 ? (
        <EmptyState icon={Tags} title="Nenhuma categoria global" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Produtos</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {c.icon ? `${c.icon} ` : ""}{c.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">/{c.slug}</td>
                    <td className="px-4 py-3 text-slate-600">{c._count.products}</td>
                    <td className="px-4 py-3">
                      <details>
                        <summary className="cursor-pointer list-none text-sm font-medium text-brand-600 hover:underline">
                          Editar
                        </summary>
                        <form
                          action={updateCategory.bind(null, c.id)}
                          className="mt-3 flex w-72 flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                        >
                          <div>
                            <label className="label-base" htmlFor={`cat-nome-${c.id}`}>Nome</label>
                            <input id={`cat-nome-${c.id}`} name="name" defaultValue={c.name} className="input-base w-40" />
                          </div>
                          <div>
                            <label className="label-base" htmlFor={`cat-icone-${c.id}`}>Ícone</label>
                            <input id={`cat-icone-${c.id}`} name="icon" defaultValue={c.icon ?? ""} className="input-base w-20" />
                          </div>
                          <Button size="sm" type="submit">Salvar</Button>
                        </form>
                      </details>
                      <form action={deleteCategory.bind(null, c.id)} className="mt-2">
                        <Button size="sm" variant="danger" type="submit">Excluir</Button>
                      </form>
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
