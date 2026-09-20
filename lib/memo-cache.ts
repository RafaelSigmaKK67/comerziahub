/**
 * Cache em memória com TTL para leituras públicas do catálogo.
 *
 * Por que em memória (e não unstable_cache): os objetos ficam intactos
 * (Decimal/Date do Prisma não viram string) e não há nenhuma mudança de
 * comportamento além da janela de frescor. Cada instância da função na Vercel
 * mantém o seu; o custo caro que ele evita é a ida ao banco (Aiven fica em
 * outra região — ~200ms por round-trip a partir de iad1).
 *
 * Erros NUNCA são cacheados: se `fn` lançar, nada é gravado e o safeQuery da
 * camada de cima aplica o fallback normalmente.
 */
type Entry = { value: unknown; expires: number };

const store = new Map<string, Entry>();

export const CATALOG_TTL_MS = 60_000; // dados públicos podem atrasar até 60s

export async function memo<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = CATALOG_TTL_MS,
): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expires > now) return hit.value as T;

  const value = await fn();
  store.set(key, { value, expires: now + ttlMs });

  // Limpeza ocasional para o Map não crescer sem limite.
  if (store.size > 500) {
    for (const [k, e] of store) {
      if (e.expires <= now) store.delete(k);
    }
  }
  return value;
}
