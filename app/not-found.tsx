import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <Logo />
      <div>
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Página não encontrada</h1>
        <p className="mt-1 text-slate-500">O conteúdo que você procura não existe ou foi movido.</p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className={buttonVariants({ variant: "primary" })}>
          Voltar ao início
        </Link>
        <Link href="/marketplace" className={buttonVariants({ variant: "outline" })}>
          Ir ao marketplace
        </Link>
      </div>
    </div>
  );
}
