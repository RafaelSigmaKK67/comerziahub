"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Feed social", href: "/feed" },
  { label: "Abrir loja", href: "/register?role=STORE_OWNER" },
  { label: "Ser entregador", href: "/register?role=COURIER" },
];

export function MobileMenu({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Menu" className="mt-6 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            {!authed && (
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                  Entrar
                </Link>
                <Link href="/register" className={buttonVariants({ variant: "primary" })}>
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
