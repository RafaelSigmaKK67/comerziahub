import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore, listStoreProducts } from "@/services/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Ativo", className: "bg-emerald-100 text-emerald-700" },
  PAUSED: { label: "Pausado", className: "bg-slate-200 text-slate-600" },
  OUT_OF_STOCK: { label: "Esgotado", className: "bg-rose-100 text-rose-700" },
  DRAFT: { label: "Rascunho", className: "bg-amber-100 text-amber-800" },
};

export default async function StoreProductsPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const products = await listStoreProducts(store.id);

  return (
    <>
      <PageHeader
        title="Produtos"
        description="Cadastre e gerencie seu catálogo."
        action={
          <Link href="/dashboard/products/new" className={buttonVariants({ variant: "primary" })}>
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum produto cadastrado"
          description="Adicione seu primeiro produto para começar a vender."
          action={
            <Link href="/dashboard/products/new" className={buttonVariants({ variant: "primary" })}>
              Cadastrar produto
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                          {p.images[0]?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </span>
                        <span className="font-medium text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatCurrency(p.basePrice)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {p._count.variants > 0 ? `${p._count.variants} variações` : p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS[p.status]?.className}>{STATUS[p.status]?.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/product/${p.id}`} className="text-sm text-brand-600 hover:underline">
                        Ver
                      </Link>
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
