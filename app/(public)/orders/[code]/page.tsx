import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, Truck, MapPin, Receipt, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getOrderByCode } from "@/services/orders";
import {
  ORDER_STATUS,
  ORDER_FLOW,
  DELIVERY_STATUS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatDate, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const order = await getOrderByCode(code);
  if (!order) notFound();

  const cancelled = order.status === "CANCELLED" || order.status === "REJECTED";
  const currentIndex = ORDER_FLOW.indexOf(order.status);

  return (
    <div className="container-page max-w-3xl py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Pedido</p>
          <h1 className="text-2xl font-bold text-slate-900">{order.code}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {order.store.name} · {formatDate(order.placedAt, true)}
          </p>
        </div>
        <Badge className={ORDER_STATUS[order.status].className + " text-sm"}>
          {ORDER_STATUS[order.status].label}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="mt-6 card p-6">
        {cancelled ? (
          <div className="flex items-center gap-3 text-rose-600">
            <XCircle className="h-6 w-6" />
            <p className="font-medium">
              Pedido {order.status === "REJECTED" ? "recusado pela loja" : "cancelado"}.
            </p>
          </div>
        ) : (
          <ol className="space-y-4">
            {ORDER_FLOW.filter((s) => s !== "COMPLETED").map((status, idx) => {
              const done = currentIndex >= idx && currentIndex >= 0;
              return (
                <li key={status} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                  <span className={done ? "font-medium text-slate-900" : "text-slate-400"}>
                    {ORDER_STATUS[status].label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Itens */}
      <div className="mt-6 card p-6">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <Receipt className="h-4 w-4" /> Itens
        </h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2.5 text-sm">
              <span className="text-slate-700">
                {i.quantity}× {i.name}
              </span>
              <span className="font-medium text-slate-900">{formatCurrency(i.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
          <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
          {toNumber(order.deliveryFee) > 0 && (
            <Row label="Frete" value={formatCurrency(order.deliveryFee)} />
          )}
          {toNumber(order.discountTotal) > 0 && (
            <Row label="Desconto" value={`- ${formatCurrency(order.discountTotal)}`} />
          )}
          {toNumber(order.cashbackEarned) > 0 && (
            <Row label="Cashback a receber" value={formatCurrency(order.cashbackEarned)} highlight />
          )}
          <div className="flex justify-between pt-2 text-base font-bold text-slate-900">
            <dt>Total</dt>
            <dd>{formatCurrency(order.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Entrega + pagamento */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {order.delivery ? (
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Truck className="h-4 w-4" /> Entrega
            </h3>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                Status:{" "}
                <Badge className={DELIVERY_STATUS[order.delivery.status].className}>
                  {DELIVERY_STATUS[order.delivery.status].label}
                </Badge>
              </p>
              {order.delivery.distanceKm > 0 && <p>Distância: {order.delivery.distanceKm} km</p>}
              <p>Tempo estimado: {order.delivery.estimatedMinutes} min</p>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <MapPin className="h-4 w-4" /> Retirada
            </h3>
            <p className="mt-3 text-sm text-slate-600">Retire o pedido na loja {order.store.name}.</p>
          </div>
        )}

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900">Pagamento</h3>
          {order.payment && (
            <p className="mt-3 text-sm text-slate-600">
              {PAYMENT_METHOD_LABELS[order.payment.method]} —{" "}
              <span className="font-medium">{order.payment.status}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/account/orders" className="text-sm font-medium text-brand-600 hover:underline">
          Ver meus pedidos
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={highlight ? "font-medium text-brand-600" : "text-slate-700"}>{value}</dd>
    </div>
  );
}
