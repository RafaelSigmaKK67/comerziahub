"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="voce@email.com" />
        <FieldError message={state.fieldErrors?.email?.[0]} />
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
        <FieldError message={state.fieldErrors?.password?.[0]} />
      </div>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:underline">
          Esqueci minha senha
        </Link>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
