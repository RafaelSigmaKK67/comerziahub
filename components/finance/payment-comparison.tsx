"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import type { PaymentMethod } from "@prisma/client";
import { PAYMENT_FEES, paymentFee, netReceived } from "@/lib/finance";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function PaymentComparison() {
  const [amount, setAmount] = useState(100);
  const methods = Object.keys(PAYMENT_FEES) as PaymentMethod[];

  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
        <CreditCard className="h-4 w-4 text-brand-600" /> Quanto você recebe por forma de pagamento
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Compare taxas e prazos de recebimento para o valor da venda.
      </p>

      <div className="mt-4 max-w-xs">
        <Label htmlFor="amount">Valor da venda (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2 pr-3">Forma</th>
              <th className="py-2 pr-3">Taxa</th>
              <th className="py-2 pr-3">Você recebe</th>
              <th className="py-2">Prazo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {methods.map((m) => {
              const f = PAYMENT_FEES[m];
              const net = netReceived(m, amount);
              return (
                <tr key={m}>
                  <td className="py-2 pr-3 font-medium text-slate-800">{f.label}</td>
                  <td className="py-2 pr-3 text-rose-600">- {formatCurrency(paymentFee(m, amount))}</td>
                  <td className="py-2 pr-3 font-semibold text-emerald-600">{formatCurrency(net)}</td>
                  <td className="py-2 text-slate-500">{f.days === 0 ? "na hora" : `${f.days} dia(s)`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Taxas ilustrativas de mercado — ajuste conforme seu adquirente/plano.
      </p>
    </div>
  );
}
