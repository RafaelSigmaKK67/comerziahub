import type { CashbackType } from "@prisma/client";

/** Calcula o valor de cashback gerado por um pedido. */
export function calcCashback(opts: {
  type: CashbackType;
  value: number;
  subtotal: number;
  maxValue?: number | null;
}): number {
  const { type, value, subtotal, maxValue } = opts;
  let amount = type === "PERCENT" ? (subtotal * value) / 100 : value;
  if (maxValue && amount > maxValue) amount = maxValue;
  return Math.max(0, Math.round(amount * 100) / 100);
}

/** Data de liberação do cashback a partir do prazo configurado. */
export function cashbackReleaseDate(from: Date, releaseAfterDays: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + releaseAfterDays);
  return d;
}

export function cashbackExpiryDate(from: Date, validityDays: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + validityDays);
  return d;
}
