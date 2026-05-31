import { PrismaClient } from "@prisma/client";

/**
 * Singleton do Prisma Client.
 * Em desenvolvimento o Next recarrega módulos a cada alteração; sem o singleton
 * abriríamos múltiplas conexões e estouraríamos o pool do banco.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
