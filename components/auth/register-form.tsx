"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ROLES = [
  { value: "CUSTOMER", label: "Cliente / comprador" },
  { value: "STORE_OWNER", label: "Dono de loja" },
  { value: "SELLER", label: "Vendedor" },
  { value: "COURIER", label: "Entregador" },
];

export function RegisterForm({ defaultRole = "CUSTOMER" }: { defaultRole?: string }) {
  const [state, action, pending] = useActionState(registerAction, {});

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" name="name" required autoComplete="name" placeholder="Seu nome" />
        <FieldError message={state.fieldErrors?.name?.[0]} />
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" />
        <FieldError message={state.fieldErrors?.email?.[0]} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="••••••••" />
          <FieldError message={state.fieldErrors?.password?.[0]} />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" name="phone" placeholder="(11) 99999-0000" />
        </div>
      </div>

      <div>
        <Label htmlFor="role">Quero usar como</Label>
        <Select id="role" name="role" defaultValue={defaultRole}>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Criando conta..." : "Criar minha conta"}
      </Button>
    </form>
  );
}
