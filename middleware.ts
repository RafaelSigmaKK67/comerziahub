import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { matchRoute, homeFor } from "@/lib/rbac";

// Instância leve do Auth.js só para ler o JWT no Edge (sem Prisma/bcrypt).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const rule = matchRoute(path);

  // Rota pública -> segue.
  if (!rule) return NextResponse.next();

  const user = req.auth?.user;

  // Não autenticado -> login com callback.
  if (!user) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // Autenticado mas sem permissão -> redireciona para a home do papel.
  if (!rule.roles.includes(user.role)) {
    return NextResponse.redirect(new URL(homeFor(user.role), nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/courier/:path*",
    "/account/:path*",
  ],
};
