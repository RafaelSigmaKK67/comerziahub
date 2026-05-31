import Link from "next/link";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Recuperar senha</h1>
      <p className="mt-1 text-sm text-slate-500">
        Informe seu e-mail e enviaremos as instruções de recuperação.
      </p>

      <div className="mt-6">
        <ForgotForm />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
