import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  Flag,
  CreditCard,
  BarChart3,
  Settings,
  Package,
  Boxes,
  Gift,
  Award,
  Ticket,
  UserCog,
  Newspaper,
  Heart,
  Wallet,
  MessageSquare,
  MapPin,
  Truck,
  DollarSign,
  FileCheck,
  Home,
  UserCircle,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  /** Só aparece para o dono da loja (e admin). */
  ownerOnly?: boolean;
};

export type NavKey = "admin" | "store" | "account" | "courier";

export const NAVS: Record<NavKey, { title: string; items: NavLink[] }> = {
  admin: {
    title: "Administração",
    items: [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Lojas", href: "/admin/stores", icon: Store },
      { label: "Usuários", href: "/admin/users", icon: Users },
      { label: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
      { label: "Rede social", href: "/admin/social", icon: Newspaper },
      { label: "Denúncias", href: "/admin/reports", icon: Flag },
      { label: "Planos", href: "/admin/plans", icon: CreditCard },
      { label: "Financeiro", href: "/admin/finance", icon: BarChart3 },
      { label: "Configurações", href: "/admin/settings", icon: Settings },
    ],
  },
  store: {
    title: "Minha loja",
    items: [
      { label: "Visão geral", href: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "Pedidos", href: "/dashboard/orders", icon: ShoppingCart },
      { label: "Produtos", href: "/dashboard/products", icon: Package },
      { label: "Estoque", href: "/dashboard/inventory", icon: Boxes },
      { label: "Clientes", href: "/dashboard/customers", icon: Users },
      { label: "Cashback", href: "/dashboard/cashback", icon: Gift, ownerOnly: true },
      { label: "Fidelidade", href: "/dashboard/loyalty", icon: Award, ownerOnly: true },
      { label: "Cupons", href: "/dashboard/coupons", icon: Ticket },
      { label: "Financeiro", href: "/dashboard/finance", icon: DollarSign, ownerOnly: true },
      { label: "Vendedores", href: "/dashboard/team", icon: UserCog, ownerOnly: true },
      { label: "Rede social", href: "/dashboard/social", icon: Newspaper },
      { label: "Configurações", href: "/dashboard/settings", icon: Settings, ownerOnly: true },
    ],
  },
  account: {
    title: "Minha conta",
    items: [
      { label: "Visão geral", href: "/account", icon: Home, exact: true },
      { label: "Meus pedidos", href: "/account/orders", icon: ShoppingCart },
      { label: "Favoritos", href: "/account/favorites", icon: Heart },
      { label: "Cashback", href: "/account/cashback", icon: Wallet },
      { label: "Fidelidade", href: "/account/loyalty", icon: Award },
      { label: "Mensagens", href: "/account/messages", icon: MessageSquare },
      { label: "Endereços", href: "/account/addresses", icon: MapPin },
      { label: "Configurações", href: "/account/settings", icon: Settings },
    ],
  },
  courier: {
    title: "Entregador",
    items: [
      { label: "Painel", href: "/courier", icon: LayoutDashboard, exact: true },
      { label: "Entregas", href: "/courier/deliveries", icon: Truck },
      { label: "Ganhos", href: "/courier/earnings", icon: DollarSign },
      { label: "Documentos", href: "/courier/documents", icon: FileCheck },
      { label: "Perfil", href: "/courier/profile", icon: UserCircle },
    ],
  },
};
