import { Package } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency, formatQuantity, toNumber } from "@/lib/utils";
import { UNIT_LABELS } from "@/lib/constants";
import { adminUpdateProduct, adminDeleteProduct } from "@/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-slate-200 text-slate-600",
  OUT_OF_STOCK: "bg-amber-100 text-amber-800",
  DRAFT: "bg-slate-100 text-slate-500",
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativo",
  PAUSED: "Pausado",
  OUT_OF_STOCK: "Sem estoque",
  DRAFT: "Rascunho",
};

export default async function AdminProductsPage() {
  const products = await safeQuery(
    () =>
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: {
          id: true,
          name: true,
          basePrice: true,
          promoPrice: true,
          costPrice: true,
          stock: true,
          unit: true,
          status: true,
          isFeatured: true,
          store: { select: { name: true } },
        },
      }),
    [],
  );

  return (
    <>
      <PageHeader
        title="Produtos"
        description="Todos os produtos da plataforma — edite preço, estoque, status e destaque, ou exclua."
      />

      {products.length === 0 ? (
        <EmptyState icon={Package} title="Nenhum produto cadastrado" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Loja</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{p.name}</p>
                      {p.isFeatured && <Badge className="mt-1 bg-brand-50 text-brand-700">Destaque</Badge>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.store.name}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatCurrency(toNumber(p.basePrice))}
                      {p.promoPrice != null && (
                        <span className="block text-xs text-accent-700">
                          promo {formatCurrency(toNumber(p.promoPrice))}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatQuantity(toNumber(p.stock), UNIT_LABELS[p.unit])}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_STYLE[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <details className="group">
                        <summary className="cursor-pointer list-none text-sm font-medium text-brand-600 hover:underline">
                          Editar
                        </summary>
                        <form
                          action={adminUpdateProduct.bind(null, p.id)}
                          className="mt-3 grid w-72 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                        >
                          <label className="label-base" htmlFor={`nome-${p.id}`}>Nome</label>
                          <input id={`nome-${p.id}`} name="name" defaultValue={p.name} className="input-base" />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="label-base" htmlFor={`preco-${p.id}`}>Preço (R$)</label>
                              <input id={`preco-${p.id}`} name="basePrice" type="number" step="0.01" min={0} defaultValue={toNumber(p.basePrice)} className="input-base" />
                            </div>
                            <div>
                              <label className="label-base" htmlFor={`promo-${p.id}`}>Promo (R$)</label>
                              <input id={`promo-${p.id}`} name="promoPrice" type="number" step="0.01" min={0} defaultValue={p.promoPrice != null ? toNumber(p.promoPrice) : ""} className="input-base" placeholder="—" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="label-base" htmlFor={`custo-${p.id}`}>Custo (R$)</label>
                              <input id={`custo-${p.id}`} name="costPrice" type="number" step="0.01" min={0} defaultValue={p.costPrice != null ? toNumber(p.costPrice) : ""} className="input-base" placeholder="—" />
                            </div>
                            <div>
                              <label className="label-base" htmlFor={`estoque-${p.id}`}>Estoque</label>
                              <input id={`estoque-${p.id}`} name="stock" type="number" step="0.001" min={0} defaultValue={toNumber(p.stock)} className="input-base" />
                            </div>
                          </div>
                          <label className="label-base" htmlFor={`status-${p.id}`}>Status</label>
                          <select id={`status-${p.id}`} name="status" defaultValue={p.status} className="input-base">
                            {Object.entries(STATUS_LABEL).map(([v, l]) => (
                              <option key={v} value={v}>{l}</option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" name="isFeatured" defaultChecked={p.isFeatured} /> Destaque na home
                          </label>
                          <Button size="sm" type="submit">Salvar</Button>
                        </form>
                      </details>
                      <form action={adminDeleteProduct.bind(null, p.id)} className="mt-2">
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
