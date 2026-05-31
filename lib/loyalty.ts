type TierLike = {
  id?: string;
  name: string;
  level: number;
  minOrders: number;
  minSpend: number;
  color?: string | null;
};

/**
 * Resolve o nível de fidelidade do cliente em uma loja, dado o histórico.
 * Retorna o maior nível cujos requisitos (compras E gasto) foram atingidos.
 */
export function resolveTier<T extends TierLike>(
  tiers: T[],
  progress: { totalOrders: number; totalSpend: number },
): T | null {
  const sorted = [...tiers].sort((a, b) => a.level - b.level);
  let current: T | null = null;
  for (const tier of sorted) {
    if (
      progress.totalOrders >= tier.minOrders &&
      progress.totalSpend >= tier.minSpend
    ) {
      current = tier;
    }
  }
  return current;
}

/** Próximo nível e progresso (0..1) rumo a ele. */
export function nextTierProgress<T extends TierLike>(
  tiers: T[],
  progress: { totalOrders: number; totalSpend: number },
): { next: T | null; ratio: number } {
  const sorted = [...tiers].sort((a, b) => a.level - b.level);
  const current = resolveTier(sorted, progress);
  const next = sorted.find((t) => t.level > (current?.level ?? 0)) ?? null;
  if (!next) return { next: null, ratio: 1 };
  const base = current?.minSpend ?? 0;
  const span = Math.max(1, next.minSpend - base);
  const ratio = Math.min(1, Math.max(0, (progress.totalSpend - base) / span));
  return { next, ratio };
}
