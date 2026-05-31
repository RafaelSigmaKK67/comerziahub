import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/session";
import { homeFor } from "@/lib/rbac";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(homeFor(user.role));
  const sp = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
      <p className="mt-1 text-sm text-slate-500">
        Entre para continuar no ComerziaHub.
      </p>

      <div className="mt-6">
        <LoginForm callbackUrl={sp.callbackUrl} />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Não tem conta?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Criar conta
        </Link>
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-semibold text-slate-600">Contas de demonstração (após seed):</p>
        <ul className="mt-2 space-y-1">
          <li>Admin — <code>admin@comerziahub.com</code></li>
          <li>Loja — <code>loja@comerziahub.com</code></li>
          <li>Cliente — <code>cliente@comerziahub.com</code></li>
          <li>Entregador — <code>entregador@comerziahub.com</code></li>
          <li>Senha para todas: <code>senha123</code></li>
        </ul>
      </div>
    </div>
  );
}
