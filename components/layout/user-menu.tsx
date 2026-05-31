"use client";

import { useState } from "react";
import Link from "next/link";
import type { UserRole } from "@prisma/client";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ROLE_LABELS } from "@/lib/constants";
import { homeFor } from "@/lib/rbac";
import { logout } from "@/actions/auth";

export function UserMenu({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-slate-100"
      >
        <Avatar src={user.image} name={user.name} size={32} />
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-700 sm:block">
          {user.name?.split(" ")[0]}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-60 animate-fade-in rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
            <div className="px-3 py-2">
              <p className="truncate font-medium text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <Link
              href={homeFor(user.role)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <LayoutDashboard className="h-4 w-4" /> Meu painel
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <User className="h-4 w-4" /> Minha conta
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
