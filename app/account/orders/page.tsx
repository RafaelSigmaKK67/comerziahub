import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { listUserOrders } from "@/services/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  const orders = await listUserOrders(user!.id);

  return (
    <>
      <PageHeader title="Meus pedidos" description="Histórico e acompanhamento das suas compras." />
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Você ainda não fez pedidos"
          action={<Link href="/marketplace" className={buttonVariants({ variant: "primary" })}>Ir ao marketplace</Link>}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.code}`}>
              <Card className="flex items-center justify-between p-4 transition hover:border-brand-200">
                <div>
                  <p className="font-medium text-slate-900">{o.code}</p>
                  <p className="text-xs text-slate-400">
                    {o.store.name} · {o.items.length} item(ns) · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={ORDER_STATUS[o.status].className}>{ORDER_STATUS[o.status].label}</Badge>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">{formatCurrency(o.total)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
