"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { simulateSale } from "@/lib/finance";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function SaleSimulator() {
  const [subtotal, setSubtotal] = useState(80);
  const [deliveryFee, setDeliveryFee] = useState(8);
  const [discount, setDiscount] = useState(0);
  const [couponPct, setCouponPct] = useState(0);
  const [cashbackPct, setCashbackPct] = useState(5);

  const r = simulateSale({ subtotal, deliveryFee, discount, couponPct, cashbackPct });

  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
        <Receipt className="h-4 w-4 text-brand-600" /> Simulador de venda (frete, desconto e cashback)
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Veja o valor final do pedido antes de fechar a venda.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Subtotal (R$)" value={subtotal} onChange={setSubtotal} step="0.01" />
        <Field label="Frete (R$)" value={deliveryFee} onChange={setDeliveryFee} step="0.01" />
        <Field label="Desconto (R$)" value={discount} onChange={setDiscount} step="0.01" />
        <Field label="Cupom (%)" value={couponPct} onChange={setCouponPct} />
        <Field label="Cashback (%)" value={cashbackPct} onChange={setCashbackPct} />
      </div>

      <dl className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-4 text-sm">
        <Row label="Subtotal" value={formatCurrency(r.subtotal)} />
        <Row label="Descontos" value={`- ${formatCurrency(r.totalDiscount)}`} />
        <Row label="Frete" value={formatCurrency(r.deliveryFee)} />
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
          <dt>Total a pagar</dt>
          <dd>{formatCurrency(r.total)}</dd>
        </div>
        <Row label="Cashback gerado" value={formatCurrency(r.cashbackGenerated)} highlight />
      </dl>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        min="0"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
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
