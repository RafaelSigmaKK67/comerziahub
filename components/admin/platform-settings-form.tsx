"use client";

import { updatePlatformSettings } from "@/actions/admin";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export type PlatformSettingsValue = {
  appName?: string;
  defaultCommission?: number;
  defaultCashback?: number;
  supportEmail?: string;
  about?: string;
};

export function PlatformSettingsForm({ value }: { value: PlatformSettingsValue }) {
  return (
    <form action={updatePlatformSettings} className="max-w-2xl space-y-4">
      <div>
        <Label htmlFor="appName">Nome da plataforma</Label>
        <Input id="appName" name="appName" defaultValue={value.appName ?? "ComerziaHub"} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="defaultCommission">Comissão padrão da plataforma (%)</Label>
          <Input id="defaultCommission" name="defaultCommission" type="number" step="0.1" min="0" defaultValue={value.defaultCommission ?? 8} />
        </div>
        <div>
          <Label htmlFor="defaultCashback">Cashback padrão sugerido (%)</Label>
          <Input id="defaultCashback" name="defaultCashback" type="number" step="0.1" min="0" defaultValue={value.defaultCashback ?? 5} />
        </div>
      </div>
      <div>
        <Label htmlFor="supportEmail">E-mail de suporte</Label>
        <Input id="supportEmail" name="supportEmail" type="email" defaultValue={value.supportEmail ?? ""} placeholder="suporte@comerziahub.com" />
      </div>
      <div>
        <Label htmlFor="about">Texto institucional</Label>
        <Textarea id="about" name="about" defaultValue={value.about ?? ""} placeholder="Sobre a plataforma..." />
      </div>
      <SubmitButton>Salvar configurações</SubmitButton>
    </form>
  );
}
