import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/session";
import { homeFor } from "@/lib/rbac";

export const metadata = { title: "Criar conta" };

const VALID_ROLES = ["CUSTOMER", "STORE_OWNER", "SELLER", "COURIER"];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(homeFor(user.role));
  const sp = await searchParams;
  const role =
    sp.role && VALID_ROLES.includes(sp.role) ? sp.role : "CUSTOMER";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Crie sua conta</h1>
      <p className="mt-1 text-sm text-slate-500">
        Leva menos de um minuto. Você pode mudar o tipo de perfil depois.
      </p>

      <div className="mt-6">
        <RegisterForm defaultRole={role} />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
