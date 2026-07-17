import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { getCartItemCount } from "@/services/cart";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Feed", href: "/feed" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  const cartCount = user ? await getCartItemCount(user.id) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3">
        <MobileMenu authed={!!user} />
        <Logo />

        <nav aria-label="Navegação principal" className="ml-2 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          action="/marketplace"
          className="ml-auto hidden w-full max-w-md md:block"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              aria-label="Buscar produtos e lojas"
              placeholder="Buscar produtos e lojas..."
              className="input-base pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 md:ml-3">
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-700 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" }) + " hidden sm:inline-flex"}
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
