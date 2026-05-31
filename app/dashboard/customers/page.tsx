import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore, getStoreCustomers } from "@/services/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StoreCustomersPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const customers = await getStoreCustomers(store.id);

  return (
    <>
      <PageHeader title="Clientes" description="Seus clientes e o nível de fidelidade de cada um." />
      {customers.length === 0 ? (
        <EmptyState icon={Users} title="Ainda sem clientes" description="Clientes aparecem após o primeiro pedido." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Nível</th>
                  <th className="px-4 py-3">Pedidos</th>
                  <th className="px-4 py-3 text-right">Total gasto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={c.user.image} name={c.user.name} size={34} />
                        <div>
                          <p className="font-medium text-slate-800">{c.user.name}</p>
                          <p className="text-xs text-slate-400">{c.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {c.tier ? (
                        <Badge style={{ backgroundColor: `${c.tier.color}22`, color: c.tier.color ?? undefined }}>
                          {c.tier.name}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.totalOrders}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{formatCurrency(c.totalSpend)}</td>
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
