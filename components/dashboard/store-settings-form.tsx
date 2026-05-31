"use client";

import { updateStoreSettings } from "@/actions/store";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export type StoreSettingsValues = {
  minOrderValue: number;
  prepTimeMinutes: number;
  deliveryFeeBase: number;
  deliveryFeePerKm: number;
  maxDeliveryRadiusKm: number;
  acceptsDelivery: boolean;
  acceptsPickup: boolean;
  cashbackEnabled: boolean;
  loyaltyEnabled: boolean;
};

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-5 w-5 accent-brand-600" />
    </label>
  );
}

export function StoreSettingsForm({
  settings,
  isOpen,
}: {
  settings: StoreSettingsValues;
  isOpen: boolean;
}) {
  return (
    <form action={updateStoreSettings} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="minOrderValue">Pedido mínimo (R$)</Label>
          <Input id="minOrderValue" name="minOrderValue" type="number" step="0.01" defaultValue={settings.minOrderValue} />
        </div>
        <div>
          <Label htmlFor="prepTimeMinutes">Tempo de preparo (min)</Label>
          <Input id="prepTimeMinutes" name="prepTimeMinutes" type="number" defaultValue={settings.prepTimeMinutes} />
        </div>
        <div>
          <Label htmlFor="deliveryFeeBase">Taxa base de entrega (R$)</Label>
          <Input id="deliveryFeeBase" name="deliveryFeeBase" type="number" step="0.01" defaultValue={settings.deliveryFeeBase} />
        </div>
        <div>
          <Label htmlFor="deliveryFeePerKm">Taxa por km (R$)</Label>
          <Input id="deliveryFeePerKm" name="deliveryFeePerKm" type="number" step="0.01" defaultValue={settings.deliveryFeePerKm} />
        </div>
        <div>
          <Label htmlFor="maxDeliveryRadiusKm">Raio de entrega (km)</Label>
          <Input id="maxDeliveryRadiusKm" name="maxDeliveryRadiusKm" type="number" step="0.1" defaultValue={settings.maxDeliveryRadiusKm} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle name="isOpen" label="Loja aberta" defaultChecked={isOpen} />
        <Toggle name="acceptsDelivery" label="Aceita entrega" defaultChecked={settings.acceptsDelivery} />
        <Toggle name="acceptsPickup" label="Aceita retirada" defaultChecked={settings.acceptsPickup} />
        <Toggle name="cashbackEnabled" label="Cashback ativo" defaultChecked={settings.cashbackEnabled} />
        <Toggle name="loyaltyEnabled" label="Fidelidade ativa" defaultChecked={settings.loyaltyEnabled} />
      </div>

      <SubmitButton>Salvar configurações</SubmitButton>
    </form>
  );
}
