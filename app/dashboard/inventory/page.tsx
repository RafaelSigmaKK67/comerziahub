import { redirect } from "next/navigation";
import { Boxes } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore, listStoreProducts } from "@/services/store";
import { toNumber, formatQuantity } from "@/lib/utils";
import { UNIT_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const products = await listStoreProducts(store.id);

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Controle de quantidades. Cada venda gera uma movimentação (StockMovement)."
      />
      {products.length === 0 ? (
        <EmptyState icon={Boxes} title="Sem produtos para controlar" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Variações</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const low = p._count.variants === 0 && toNumber(p.stock) <= 5;
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                      <td className="px-4 py-3 text-slate-600">{p._count.variants}</td>
                      <td className="px-4 py-3 text-slate-700">{p._count.variants > 0 ? "—" : formatQuantity(p.stock, UNIT_LABELS[p.unit])}</td>
                      <td className="px-4 py-3">
                        {p._count.variants > 0 ? (
                          <Badge className="bg-slate-100 text-slate-600">Por variação</Badge>
                        ) : low ? (
                          <Badge className="bg-rose-100 text-rose-700">Estoque baixo</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-700">Ok</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
