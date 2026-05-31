"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, {});

  if (state.success) {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}
      <div>
        <Label htmlFor="email">E-mail da conta</Label>
        <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}
