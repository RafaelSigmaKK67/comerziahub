import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { APP } from "@/lib/constants";

const cols = [
  {
    title: "Plataforma",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Feed social", href: "/feed" },
      { label: "Seja um entregador", href: "/register?role=COURIER" },
      { label: "Abra sua loja", href: "/register?role=STORE_OWNER" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Cashback", href: "/marketplace" },
      { label: "Programa de fidelidade", href: "/marketplace" },
      { label: "Delivery", href: "/marketplace" },
      { label: "Controle de estoque", href: "/dashboard" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Entrar", href: "/login" },
      { label: "Criar conta", href: "/register" },
      { label: "Minha conta", href: "/account" },
      { label: "Carrinho", href: "/cart" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-slate-500">{APP.description}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-sm font-semibold text-slate-900">{c.title}</h2>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-500 transition hover:text-brand-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 pb-24 text-xs text-slate-400 sm:flex-row md:pb-6">
          <p>
            © {new Date().getFullYear()} {APP.name}. Projeto demonstrativo —
            arquitetura de referência.
          </p>
          <p>Feito com Next.js, Prisma e Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
