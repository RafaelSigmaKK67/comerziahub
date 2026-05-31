/**
 * Executa uma consulta ao banco de forma resiliente.
 * Se o banco não estiver configurado (ex.: primeiro deploy sem DATABASE_URL)
 * retornamos o fallback em vez de quebrar a renderização da página.
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[safeQuery] falha ao consultar o banco:", error);
    }
    return fallback;
  }
}
