"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAddress } from "@/actions/account";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddressForm() {
  const [state, action, pending] = useActionState(createAddress, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state.success]);

  return (
    <form ref={ref} action={action} className="space-y-3">
      {state.error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.message}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="label">Apelido</Label>
          <Input id="label" name="label" placeholder="Casa, Trabalho..." />
        </div>
        <div>
          <Label htmlFor="zip">CEP</Label>
          <Input id="zip" name="zip" placeholder="00000-000" />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_120px] gap-3">
        <div>
          <Label htmlFor="street">Rua</Label>
          <Input id="street" name="street" required />
          <FieldError message={state.fieldErrors?.street?.[0]} />
        </div>
        <div>
          <Label htmlFor="number">Número</Label>
          <Input id="number" name="number" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" name="district" />
        </div>
        <div>
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_100px] gap-3">
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" required />
          <FieldError message={state.fieldErrors?.city?.[0]} />
        </div>
        <div>
          <Label htmlFor="state">UF</Label>
          <Input id="state" name="state" maxLength={2} required />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Adicionar endereço"}
      </Button>
    </form>
  );
}
