"use client";

import { saveCashbackRule } from "@/actions/store";
import { Input, Select, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function CashbackForm({
  current,
}: {
  current?: {
    name: string;
    type: "PERCENT" | "FIXED";
    value: number;
    minOrderValue: number;
    releaseAfterDays: number;
    validityDays: number;
    excludePromoProducts: boolean;
  } | null;
}) {
  return (
    <form action={saveCashbackRule} className="max-w-2xl space-y-4">
      <div>
        <Label htmlFor="name">Nome da campanha</Label>
        <Input id="name" name="name" defaultValue={current?.name ?? "Cashback padrão"} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select id="type" name="type" defaultValue={current?.type ?? "PERCENT"}>
            <option value="PERCENT">Percentual (%)</option>
            <option value="FIXED">Valor fixo (R$)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Valor</Label>
          <Input id="value" name="value" type="number" step="0.01" defaultValue={current?.value ?? 5} />
        </div>
        <div>
          <Label htmlFor="minOrderValue">Pedido mínimo (R$)</Label>
          <Input id="minOrderValue" name="minOrderValue" type="number" step="0.01" defaultValue={current?.minOrderValue ?? 0} />
        </div>
        <div>
          <Label htmlFor="releaseAfterDays">Liberar após (dias)</Label>
          <Input id="releaseAfterDays" name="releaseAfterDays" type="number" defaultValue={current?.releaseAfterDays ?? 7} />
        </div>
        <div>
          <Label htmlFor="validityDays">Validade (dias)</Label>
          <Input id="validityDays" name="validityDays" type="number" defaultValue={current?.validityDays ?? 90} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="excludePromoProducts" defaultChecked={current?.excludePromoProducts ?? false} className="h-4 w-4 accent-brand-600" />
        Não dar cashback em produtos promocionais
      </label>
      <SubmitButton>Salvar campanha</SubmitButton>
    </form>
  );
}
