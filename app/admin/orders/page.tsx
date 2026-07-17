import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import { adminSetOrderStatus } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await safeQuery(
    () =>
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          store: { select: { name: true } },
          customer: { select: { name: true } },
        },
      }),
    [],
  );

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Todos os pedidos da plataforma — o admin pode alterar o status de qualquer pedido."
      />
      {orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Nenhum pedido ainda" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Loja</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Alterar status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{o.code}</td>
                    <td className="px-4 py-3 text-slate-600">{o.store.name}</td>
                    <td className="px-4 py-3 text-slate-600">{o.customer.name}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge className={ORDER_STATUS[o.status].className}>{ORDER_STATUS[o.status].label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3">
                      <form action={adminSetOrderStatus.bind(null, o.id)} className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`o-status-${o.id}`}>Novo status do pedido {o.code}</label>
                        <select id={`o-status-${o.id}`} name="status" defaultValue={o.status} className="input-base w-44 py-1.5">
                          {Object.entries(ORDER_STATUS).map(([v, s]) => (
                            <option key={v} value={v}>{s.label}</option>
                          ))}
                        </select>
                        <Button size="sm" variant="outline" type="submit">Aplicar</Button>
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
