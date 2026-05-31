import type { NextAuthConfig } from "next-auth";

/**
 * Configuração base do Auth.js — compatível com o Edge Runtime (middleware).
 * NÃO importa Prisma nem bcrypt aqui. O provider de credenciais (que usa o banco)
 * é adicionado em `lib/auth.ts`, executado apenas no Node runtime.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        // `role` é injetado pelo provider de credenciais
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as never;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
