"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { addToCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { cn, formatQuantity } from "@/lib/utils";

type VariantOption = { id: string; name: string; stock: number };

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function AddToCart({
  productId,
  variants,
  disabled,
  step = 1,
  unit,
}: {
  productId: string;
  variants: VariantOption[];
  disabled?: boolean;
  step?: number;
  unit?: string;
}) {
  const safeStep = step > 0 ? step : 1;
  const [qty, setQty] = useState(safeStep);
  const [variantId, setVariantId] = useState<string | undefined>(variants[0]?.id);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  function handleAdd() {
    start(async () => {
      const res = await addToCart({ productId, variantId, quantity: qty });
      if (res.error === "AUTH_REQUIRED") {
        router.push(`/login?callbackUrl=/product/${productId}`);
        return;
      }
      if (res.success) {
        setDone(true);
        router.refresh();
        setTimeout(() => setDone(false), 2200);
      }
    });
  }

  return (
    <div className="space-y-4">
      {variants.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Variação</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                disabled={v.stock <= 0}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm transition",
                  variantId === v.id
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-300 text-slate-700 hover:border-slate-400",
                  v.stock <= 0 && "cursor-not-allowed opacity-40",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-slate-300">
          <button
            type="button"
            onClick={() => setQty((q) => r3(Math.max(safeStep, q - safeStep)))}
            className="px-3 py-2.5 text-slate-600 hover:text-slate-900"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-16 px-1 text-center text-sm font-medium">
            {formatQuantity(qty, unit)}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => r3(q + safeStep))}
            className="px-3 py-2.5 text-slate-600 hover:text-slate-900"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          onClick={handleAdd}
          disabled={pending || disabled}
          variant={done ? "secondary" : "primary"}
          className="flex-1"
        >
          {done ? (
            <>
              <Check className="h-4 w-4" /> Adicionado
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {pending ? "Adicionando..." : "Adicionar ao carrinho"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
