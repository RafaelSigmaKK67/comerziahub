import { auth } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
};

/** Retorna o usuário autenticado (ou null) em server components / actions. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth();
    if (!session?.user) return null;
    return session.user as SessionUser;
  } catch {
    // Ex.: AUTH_SECRET ausente em um primeiro deploy. Trata como deslogado.
    return null;
  }
}

/** Garante autenticação; lança se não houver usuário. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}
