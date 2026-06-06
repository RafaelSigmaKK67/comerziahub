"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { suggestPrice, DEFAULT_COMMISSION_PCT } from "@/lib/finance";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency, formatPercent } from "@/lib/utils";

const round = (n: number) => Math.round(n * 100) / 100;

export function PriceSimulator() {
  const [cost, setCost] = useState(10);
  const [margin, setMargin] = useState(30);
  const [commission, setCommission] = useState(DEFAULT_COMMISSION_PCT);
  const [extra, setExtra] = useState(0);
  const [current, setCurrent] = useState(0);

  const suggested = suggestPrice({ cost, marginPct: margin, commissionPct: commission, extraPct: extra });
  const price = current > 0 ? current : suggested;
  const profit = round(price - cost - (price * commission) / 100 - (price * extra) / 100);
  const realMargin = price > 0 ? round((profit / price) * 100) : 0;
  const isLoss = profit < 0;

  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
        <Calculator className="h-4 w-4 text-brand-600" /> Simulador de preço com margem
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Informe o custo e a margem desejada para descobrir o preço ideal.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Custo (R$)" value={cost} onChange={setCost} step="0.01" />
        <Field label="Margem (%)" value={margin} onChange={setMargin} />
        <Field label="Comissão (%)" value={commission} onChange={setCommission} />
        <Field label="Custos extra (%)" value={extra} onChange={setExtra} />
      </div>

      <div className="mt-4 rounded-xl bg-brand-50 p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-brand-700">Preço de venda sugerido</p>
        <p className="text-3xl font-extrabold text-brand-700">{formatCurrency(suggested)}</p>
      </div>

      <div className="mt-4">
        <Label htmlFor="current">Comparar com preço atual (opcional)</Label>
        <Input
          id="current"
          type="number"
          step="0.01"
          min="0"
          value={current || ""}
          placeholder="ex.: 14,90"
          onChange={(e) => setCurrent(Number(e.target.value) || 0)}
        />
      </div>

      <div className={`mt-3 flex items-center justify-between rounded-xl p-3 text-sm ${isLoss ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
        <span>{isLoss ? "⚠️ Prejuízo neste preço" : "✓ Lucro neste preço"}</span>
        <span className="font-semibold">
          {formatCurrency(profit)} · margem {formatPercent(realMargin)}
        </span>
      </div>
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
