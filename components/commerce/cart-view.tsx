"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { updateCartItem, removeCartItem, clearCart } from "@/actions/cart";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatQuantity } from "@/lib/utils";

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  image: string | null;
  storeName: string;
  variant: string | null;
  unitPrice: number;
  quantity: number;
  unit?: string | null;
  step?: number;
};

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function CartView({ items }: { items: CartLine[] }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const update = (id: string, qty: number) =>
    start(async () => {
      await updateCartItem(id, qty);
      router.refresh();
    });
  const remove = (id: string) =>
    start(async () => {
      await removeCartItem(id);
      router.refresh();
    });
  const clear = () =>
    start(async () => {
      await clearCart();
      router.refresh();
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <Link href={`/product/${i.productId}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {i.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand-200">
                  {i.name[0]}
                </span>
              )}
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">{i.storeName}</p>
                  <Link href={`/product/${i.productId}`} className="font-medium text-slate-800 hover:text-brand-600">
                    {i.name}
                  </Link>
                  {i.variant && <p className="text-xs text-slate-500">{i.variant}</p>}
                </div>
                <button
                  onClick={() => remove(i.id)}
                  disabled={pending}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button onClick={() => update(i.id, r3(i.quantity - (i.step || 1)))} disabled={pending} className="px-2.5 py-1.5 text-slate-600">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-14 px-1 text-center text-sm">{formatQuantity(i.quantity, i.unit)}</span>
                  <button onClick={() => update(i.id, r3(i.quantity + (i.step || 1)))} disabled={pending} className="px-2.5 py-1.5 text-slate-600">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="font-semibold text-slate-900">{formatCurrency(i.unitPrice * i.quantity)}</p>
              </div>
            </div>
          </div>
        ))}

        <button onClick={clear} disabled={pending} className="text-sm text-slate-500 hover:text-rose-600">
          Esvaziar carrinho
        </button>
      </div>

      {/* Resumo */}
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">Resumo</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-slate-400">
            <dt>Frete</dt>
            <dd>calculado no checkout</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
            <dt>Total estimado</dt>
            <dd>{formatCurrency(subtotal)}</dd>
          </div>
        </dl>
        <Link href="/checkout" className={buttonVariants({ variant: "primary" }) + " mt-5 w-full"}>
          <ShoppingBag className="h-4 w-4" /> Finalizar compra
        </Link>
        <Link href="/marketplace" className="mt-2 block text-center text-sm text-slate-500 hover:underline">
          Continuar comprando
        </Link>
      </aside>
    </div>
  );
}
