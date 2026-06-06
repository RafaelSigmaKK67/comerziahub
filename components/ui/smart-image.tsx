"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Imagem com fallback elegante: se a URL estiver vazia, quebrada ou der erro,
 * exibe um placeholder em gradiente da marca com a inicial do título.
 * Usada em produtos, lojas, banners e publicações.
 */
export function SmartImage({
  src,
  alt = "",
  className,
  fallbackText,
  icon: Icon,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackText?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const [errored, setErrored] = useState(false);
  const valid = src && src.trim().length > 0 && !errored;

  if (!valid) {
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
