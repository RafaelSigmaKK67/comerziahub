import { PrismaClient } from "@prisma/client";

/**
 * Singleton do Prisma Client.
 * Em desenvolvimento o Next recarrega módulos a cada alteração; sem o singleton
 * abriríamos múltiplas conexões e estouraríamos o pool do banco.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fallback evita erro de instanciação quando DATABASE_URL ainda não foi
// configurada (ex.: primeiro deploy). Consultas reais falham e são tratadas
// por safeQuery() retornando dados vazios, sem derrubar a página.
const datasourceUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
