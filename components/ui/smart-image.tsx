"use client";

import { useState } from "react";
import { Store, Package, ImageIcon, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mapa de ícones de fallback. Usamos uma CHAVE (string) em vez de receber o
 * componente do ícone por prop — assim a SmartImage pode ser usada tanto por
 * Server Components quanto por Client Components (funções/componentes não podem
 * ser passados de um Server Component para um Client Component).
 */
const ICONS = {
  store: Store,
  package: Package,
  image: ImageIcon,
  user: User,
  bag: ShoppingBag,
} as const;

export type SmartImageIcon = keyof typeof ICONS;

/**
 * Imagem com fallback elegante: se a URL estiver vazia, quebrada ou der erro,
 * exibe um placeholder em gradiente da marca com um ícone ou a inicial do título.
 * Usada em produtos, lojas, banners e publicações.
 */
export function SmartImage({
  src,
  alt = "",
  className,
  fallbackText,
  iconName,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackText?: string | null;
  iconName?: SmartImageIcon;
}) {
  const [errored, setErrored] = useState(false);
  const valid = src && src.trim().length > 0 && !errored;

  if (!valid) {
    const Icon = iconName ? ICONS[iconName] : null;
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-brand-100 to-slate-100 text-brand-400 dark:from-brand-500/20 dark:to-slate-800/40",
          className,
        )}
        aria-label={alt}
      >
        {Icon ? (
          <Icon className="h-1/3 w-1/3 opacity-70" />
        ) : (
          <span className="text-2xl font-bold opacity-80">
            {fallbackText?.trim()?.[0]?.toUpperCase() ?? "•"}
          </span>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
