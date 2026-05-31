"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Truck, Store, MapPin } from "lucide-react";
import { placeOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type AddressOption = {
  id: string;
  label: string;
};

type Line = { name: string; quantity: number; total: number; store: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-4 w-full" size="lg">
      {pending ? "Processando pedido..." : "Confirmar pedido"}
    </Button>
  );
}

export function CheckoutForm({
  addresses,
  lines,
  subtotal,
}: {
  addresses: AddressOption[];
  lines: Line[];
  subtotal: number;
}) {
  const [fulfillment, setFulfillment] = useState<"DELIVERY" | "PICKUP">("DELIVERY");

  return (
    <form action={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Entrega */}
        <section className="card p-6">
          <h2 className="font-semibold text-slate-900">Como deseja receber?</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${fulfillment === "DELIVERY" ? "border-brand-500 bg-brand-50" : "border-slate-300"}`}
            >
              <input
                type="radio"
                name="fulfillmentType"
                value="DELIVERY"
                checked={fulfillment === "DELIVERY"}
                onChange={() => setFulfillment("DELIVERY")}
                className="accent-brand-600"
              />
              <Truck className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium">Entrega</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${fulfillment === "PICKUP" ? "border-brand-500 bg-brand-50" : "border-slate-300"}`}
            >
              <input
                type="radio"
                name="fulfillmentType"
                value="PICKUP"
                checked={fulfillment === "PICKUP"}
                onChange={() => setFulfillment("PICKUP")}
                className="accent-brand-600"
              />
              <Store className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium">Retirar no local</span>
            </label>
          </div>

          {fulfillment === "DELIVERY" && (
            <div className="mt-4">
              <label className="label-base">Endereço de entrega</label>
              {addresses.length > 0 ? (
                <select name="addressId" className="input-base" required>
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                  <MapPin className="h-4 w-4" />
                  Você ainda não tem endereços.{" "}
                  <Link href="/account/addresses" className="font-medium underline">
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Pagamento */}
        <section className="card p-6">
          <h2 className="font-semibold text-slate-900">Pagamento</h2>
          <p className="mt-1 text-xs text-slate-400">
            Integração com gateway é preparada (mock). Nenhuma cobrança real é feita.
          </p>
          <select name="paymentMethod" className="input-base mt-3" defaultValue="PIX">
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </section>

        {/* Observações */}
        <section className="card p-6">
          <h2 className="font-semibold text-slate-900">Observações</h2>
          <textarea
            name="notes"
            className="input-base mt-3"
            placeholder="Ponto de referência, troco, instruções..."
          />
        </section>
      </div>

      {/* Resumo */}
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Seu pedido</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {lines.map((l, idx) => (
            <li key={idx} className="flex justify-between text-slate-600">
              <span className="truncate">
                {l.quantity}× {l.name}
              </span>
              <span>{formatCurrency(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-400">
            <dt>Frete</dt>
            <dd>{fulfillment === "PICKUP" ? "Grátis (retirada)" : "Calculado por loja"}</dd>
          </div>
        </dl>
        <SubmitButton />
        <p className="mt-2 text-center text-xs text-slate-400">
          Pedidos de lojas diferentes são separados automaticamente.
        </p>
      </aside>
    </form>
  );
}
