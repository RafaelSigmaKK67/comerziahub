import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Combina classes Tailwind resolvendo conflitos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Numeric = number | string | { toString(): string } | null | undefined;

/** Converte Decimal do Prisma / string / number em number seguro. */
export function toNumber(value: Numeric): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number(value.toString());
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(value: Numeric, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(toNumber(value));
}

export function formatNumber(value: Numeric) {
  return new Intl.NumberFormat("pt-BR").format(toNumber(value));
}

export function formatDate(date: Date | string, withTime = false) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(d);
}

export function formatRelative(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function initials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Código legível de pedido, ex.: CMZ-7K2P9Q */
export function generateOrderCode() {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `CMZ-${s}`;
}

/** Preço efetivo de um produto considerando promoção vigente. */
export function effectivePrice(p: {
  basePrice: Numeric;
  promoPrice?: Numeric;
  promoStartsAt?: Date | null;
  promoEndsAt?: Date | null;
}) {
  const base = toNumber(p.basePrice);
  const promo = toNumber(p.promoPrice);
  if (!promo || promo <= 0) return { price: base, isPromo: false, base };
  const now = Date.now();
  const startsOk = !p.promoStartsAt || new Date(p.promoStartsAt).getTime() <= now;
  const endsOk = !p.promoEndsAt || new Date(p.promoEndsAt).getTime() >= now;
  if (startsOk && endsOk) return { price: promo, isPromo: true, base };
  return { price: base, isPromo: false, base };
}
