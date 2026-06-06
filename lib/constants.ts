import type {
  UserRole,
  OrderStatus,
  DeliveryStatus,
  StoreStatus,
  PaymentMethod,
  MeasureUnit,
} from "@prisma/client";

export const UNIT_LABELS: Record<MeasureUnit, string> = {
  UN: "un",
  KG: "kg",
  G: "g",
  L: "L",
  ML: "ml",
  PACOTE: "pct",
  CAIXA: "cx",
  DUZIA: "dz",
  METRO: "m",
  PORCAO: "porção",
};

export const UNIT_OPTIONS: { value: MeasureUnit; label: string }[] = [
  { value: "UN", label: "Unidade" },
  { value: "KG", label: "Quilograma (kg)" },
  { value: "G", label: "Grama (g)" },
  { value: "L", label: "Litro (L)" },
  { value: "ML", label: "Mililitro (ml)" },
  { value: "PACOTE", label: "Pacote" },
  { value: "CAIXA", label: "Caixa" },
  { value: "DUZIA", label: "Dúzia" },
  { value: "METRO", label: "Metro" },
  { value: "PORCAO", label: "Porção" },
];

/** Unidades vendidas por peso/volume (fracionáveis). */
export const FRACTIONAL_UNITS: MeasureUnit[] = ["KG", "G", "L", "ML", "METRO"];

export const APP = {
  name: "ComerziaHub",
  description:
    "Plataforma completa de estoque, delivery, marketplace e rede social comercial — para lojas, vendedores, compradores e entregadores.",
  tagline: "Venda, entregue, conecte. Tudo em um só lugar.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  STORE_OWNER: "Dono de loja",
  STORE_EMPLOYEE: "Vendedor",
  SELLER: "Vendedor",
  CUSTOMER: "Cliente",
  COURIER: "Entregador",
  MODERATOR: "Moderador",
};

export const STORE_STATUS_LABELS: Record<StoreStatus, string> = {
  PENDING: "Pendente",
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  SUSPENDED: "Suspensa",
};

/** Rótulo + cor (classes Tailwind) por status de pedido. */
export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Aguardando aceite", className: "bg-amber-100 text-amber-800" },
  ACCEPTED: { label: "Aceito", className: "bg-sky-100 text-sky-800" },
  REJECTED: { label: "Recusado", className: "bg-rose-100 text-rose-800" },
  PREPARING: { label: "Em separação", className: "bg-indigo-100 text-indigo-800" },
  READY: { label: "Pronto", className: "bg-violet-100 text-violet-800" },
  OUT_FOR_DELIVERY: { label: "Saiu para entrega", className: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-100 text-emerald-800" },
  COMPLETED: { label: "Concluído", className: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelado", className: "bg-slate-200 text-slate-700" },
};

/** Sequência padrão do funil de pedido (para timelines). */
export const ORDER_FLOW: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
];

export const DELIVERY_STATUS: Record<
  DeliveryStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Disponível", className: "bg-amber-100 text-amber-800" },
  ASSIGNED: { label: "Atribuída", className: "bg-sky-100 text-sky-800" },
  ACCEPTED: { label: "Aceita", className: "bg-indigo-100 text-indigo-800" },
  PICKED_UP: { label: "Coletada", className: "bg-violet-100 text-violet-800" },
  IN_TRANSIT: { label: "A caminho", className: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelada", className: "bg-slate-200 text-slate-700" },
  FAILED: { label: "Falhou", className: "bg-rose-100 text-rose-800" },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  CASH_ON_DELIVERY: "Pagamento na entrega",
  WALLET: "Carteira interna",
  CASHBACK: "Cashback",
};

/** Níveis de fidelidade sugeridos (uma loja pode customizar). */
export const DEFAULT_LOYALTY_TIERS = [
  { name: "Bronze", level: 1, minOrders: 0, minSpend: 0, color: "#b45309" },
  { name: "Prata", level: 2, minOrders: 5, minSpend: 250, color: "#64748b" },
  { name: "Ouro", level: 3, minOrders: 15, minSpend: 800, color: "#ca8a04" },
  { name: "Diamante", level: 4, minOrders: 30, minSpend: 2000, color: "#0891b2" },
  { name: "VIP", level: 5, minOrders: 60, minSpend: 5000, color: "#7c3aed" },
] as const;
