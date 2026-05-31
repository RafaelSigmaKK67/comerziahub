import { redirect } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/session";
import { getManagedStore } from "@/services/store";
import { listStoreOrders } from "@/services/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS } from "@/lib/constants";
import { updateOrderStatus } from "@/actions/orders";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function NextActions({ id, status, fulfillment }: { id: string; status: OrderStatus; fulfillment: string }) {
  const Btn = (next: OrderStatus, label: string, variant: "primary" | "outline" = "primary") => (
    <form action={updateOrderStatus.bind(null, id, next)}>
      <Button size="sm" variant={variant} type="submit">{label}</Button>
    </form>
  );

  switch (status) {
    case "PENDING":
      return (
        <>
          {Btn("ACCEPTED", "Aceitar")}
          {Btn("REJECTED", "Recusar", "outline")}
        </>
      );
    case "ACCEPTED":
      return Btn("PREPARING", "Iniciar separação");
    case "PREPARING":
      return Btn("READY", "Marcar pronto");
    case "READY":
      return fulfillment === "DELIVERY"
        ? Btn("OUT_FOR_DELIVERY", "Saiu para entrega")
        : Btn("DELIVERED", "Entregue");
    case "OUT_FOR_DELIVERY":
      return Btn("DELIVERED", "Confirmar entrega");
    case "DELIVERED":
      return Btn("COMPLETED", "Concluir");
    default:
      return null;
  }
}

export default async function StoreOrdersPage() {
  const user = await getCurrentUser();
  const store = await getManagedStore(user!.id);
  if (!store) redirect("/dashboard");

  const orders = await listStoreOrders(store.id);

  return (
    <>
      <PageHeader title="Pedidos" description="Aceite, prepare e acompanhe as entregas." />

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Nenhum pedido ainda" description="Os pedidos dos clientes aparecerão aqui." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={o.customer.image} name={o.customer.name} size={40} />
                  <div>
                    <p className="font-medium text-slate-900">
                      {o.code}{" "}
                      <span className="text-sm font-normal text-slate-400">
                        · {o.fulfillmentType === "DELIVERY" ? "Entrega" : "Retirada"}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {o.customer.name} · {formatDate(o.createdAt, true)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={ORDER_STATUS[o.status].className}>{ORDER_STATUS[o.status].label}</Badge>
                  <span className="font-semibold text-slate-900">{formatCurrency(o.total)}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <p className="text-sm text-slate-500">
                  {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <NextActions id={o.id} status={o.status} fulfillment={o.fulfillmentType} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
