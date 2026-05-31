"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Newspaper, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Início", href: "/", icon: Home, exact: true },
  { label: "Lojas", href: "/marketplace", icon: Store },
  { label: "Feed", href: "/feed", icon: Newspaper },
  { label: "Carrinho", href: "/cart", icon: ShoppingCart },
  { label: "Conta", href: "/account", icon: User },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.exact ? path === it.href : path.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition",
                active ? "text-brand-600" : "text-slate-500",
              )}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
