import type { PaymentMethod } from "@prisma/client";
import { toNumber } from "@/lib/utils";

const round = (n: number) => Math.round(n * 100) / 100;

/** Taxa da plataforma padrão (%) — pode ser sobrescrita por loja/plano. */
export const DEFAULT_COMMISSION_PCT = 8;

/**
 * Taxas e prazos por forma de pagamento (valores ilustrativos de mercado).
 * feePct = % sobre o valor; feeFixed = taxa fixa por transação; days = prazo de recebimento.
 */
export const PAYMENT_FEES: Record<
  PaymentMethod,
  { feePct: number; feeFixed: number; days: number; label: string }
> = {
  PIX: { feePct: 0.99, feeFixed: 0, days: 0, label: "Pix" },
  CREDIT_CARD: { feePct: 3.99, feeFixed: 0.39, days: 30, label: "Cartão de crédito" },
  DEBIT_CARD: { feePct: 1.99, feeFixed: 0.39, days: 1, label: "Cartão de débito" },
  CASH_ON_DELIVERY: { feePct: 0, feeFixed: 0, days: 0, label: "Na entrega (dinheiro)" },
  WALLET: { feePct: 0, feeFixed: 0, days: 0, label: "Carteira interna" },
  CASHBACK: { feePct: 0, feeFixed: 0, days: 0, label: "Cashback" },
};

export function paymentFee(method: PaymentMethod, amount: number) {
  const f = PAYMENT_FEES[method];
  return round((amount * f.feePct) / 100 + f.feeFixed);
}

export function netReceived(method: PaymentMethod, amount: number) {
  return round(amount - paymentFee(method, amount));
}

export type OrderFinanceInput = {
  subtotal: number;
  costTotal: number;
  deliveryFee?: number;
  discount?: number;
  cashbackEarned?: number;
  commissionPct?: number;
  method: PaymentMethod;
};

export type OrderFinance = {
  revenue: number;
  costTotal: number;
  commissionFee: number;
  paymentFee: number;
  cashbackEarned: number;
  netProfit: number;
  margin: number; // %
  isLoss: boolean;
};

/**
 * Lucro líquido do LOJISTA em um pedido:
 *   receita (subtotal - desconto) - custo dos produtos - comissão da plataforma
 *   - taxa da forma de pagamento - cashback concedido.
 * (O frete é repassado ao entregador; é neutro para a loja.)
 */
export function calcOrderFinance(input: OrderFinanceInput): OrderFinance {
  const subtotal = toNumber(input.subtotal);
  const costTotal = toNumber(input.costTotal);
  const deliveryFee = toNumber(input.deliveryFee);
  const discount = toNumber(input.discount);
  const cashbackEarned = toNumber(input.cashbackEarned);
  const commissionPct = input.commissionPct ?? DEFAULT_COMMISSION_PCT;

  const revenue = round(subtotal - discount);
  const commissionFee = round((revenue * commissionPct) / 100);
  const pFee = paymentFee(input.method, revenue + deliveryFee);
  const netProfit = round(revenue - costTotal - commissionFee - pFee - cashbackEarned);

  return {
    revenue,
    costTotal,
    commissionFee,
    paymentFee: pFee,
    cashbackEarned,
    netProfit,
    margin: revenue > 0 ? round((netProfit / revenue) * 100) : 0,
    isLoss: netProfit < 0,
  };
}

/**
 * Sugere o preço de venda a partir do custo e da margem desejada,
 * já embutindo comissão e custos extras (%).
 *   preço = custo / (1 - (margem + comissão + extra)/100)
 */
export function suggestPrice(opts: {
  cost: number;
  marginPct: number;
  commissionPct?: number;
  extraPct?: number;
}) {
  const cost = toNumber(opts.cost);
  const totalPct =
    toNumber(opts.marginPct) +
    (opts.commissionPct ?? DEFAULT_COMMISSION_PCT) +
    toNumber(opts.extraPct);
  if (totalPct >= 95) return round(cost * 5); // evita divisão instável
  return round(cost / (1 - totalPct / 100));
}

/** Simula o total final de uma venda para o cliente. */
export function simulateSale(opts: {
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  couponPct?: number;
  cashbackPct?: number;
}) {
  const subtotal = toNumber(opts.subtotal);
  const deliveryFee = toNumber(opts.deliveryFee);
  const fixedDiscount = toNumber(opts.discount);
  const couponDiscount = round((subtotal * toNumber(opts.couponPct)) / 100);
  const totalDiscount = round(fixedDiscount + couponDiscount);
  const total = round(Math.max(0, subtotal - totalDiscount + deliveryFee));
  const cashbackGenerated = round(((subtotal - totalDiscount) * toNumber(opts.cashbackPct)) / 100);
  return { subtotal, deliveryFee, totalDiscount, total, cashbackGenerated };
}
