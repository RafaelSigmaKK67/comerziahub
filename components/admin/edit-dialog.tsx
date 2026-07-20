"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Diálogo modal reutilizável do painel admin: o gatilho é um botão padrão e o
 * conteúdo (um form com server action) abre num card sobreposto com o fundo
 * escurecido e desfocado. Fecha ao clicar fora, no X, com Esc ou após enviar.
 * Renderiza via portal no <body> (o backdrop-filter dos cards criaria um
 * containing block e prenderia o position:fixed dentro da tabela).
 */
export function EditDialog({
  trigger = "Editar",
  title,
  variant = "outline",
  size = "sm",
  children,
}: {
  trigger?: string;
  title: string;
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button type="button" size={size} variant={variant} onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="card max-h-[85vh] w-full max-w-lg overflow-y-auto bg-white p-6"
              onClick={(e) => e.stopPropagation()}
              onSubmit={() => setTimeout(() => setOpen(false), 350)}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
