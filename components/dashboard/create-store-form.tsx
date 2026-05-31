"use client";

import { useActionState } from "react";
import { createStore } from "@/actions/store";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateStoreForm() {
  const [state, action, pending] = useActionState(createStore, {});
  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.error}</p>
      )}
      <div>
        <Label htmlFor="name">Nome da loja</Label>
        <Input id="name" name="name" required placeholder="Ex.: Hortifruti do Bairro" />
        <FieldError message={state.fieldErrors?.name?.[0]} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="segment">Segmento</Label>
          <Input id="segment" name="segment" placeholder="Mercado, Moda, Restaurante..." />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" name="phone" placeholder="(11) 99999-0000" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" placeholder="Conte sobre sua loja..." />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Criando loja..." : "Criar loja"}
      </Button>
    </form>
  );
}
