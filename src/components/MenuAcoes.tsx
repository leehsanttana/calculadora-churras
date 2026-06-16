"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface AcaoMenu {
  label: string;
  icone?: string;
  /** Se presente, o item vira um link de navegação. */
  href?: string;
  onClick?: () => void;
  /** Estilo destrutivo (vermelho), ex.: excluir. */
  perigo?: boolean;
}

/**
 * Botão de ações (3 pontinhos) que abre um dropdown no estilo "sticker" do app.
 * Fecha ao clicar fora, no Escape ou ao escolher uma opção.
 */
export default function MenuAcoes({
  acoes,
  rotulo = "Ações",
}: {
  acoes: AcaoMenu[];
  rotulo?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={rotulo}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
        className="flex size-9 items-center justify-center rounded-full border border-black/15 text-xl leading-none text-foreground/70 transition-colors hover:bg-primary-soft hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/20"
      >
        ⋮
      </button>

      {aberto && (
        <div
          role="menu"
          className="animate-dropdown absolute right-0 top-full z-30 mt-1.5 min-w-[10rem] overflow-hidden rounded-xl border-2 border-foreground bg-surface shadow-pop-sm"
        >
          {acoes.map((a) => {
            const classe = `flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              a.perigo
                ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                : "hover:bg-primary-soft"
            }`;
            const conteudo = (
              <>
                {a.icone && <span aria-hidden>{a.icone}</span>}
                {a.label}
              </>
            );
            return a.href ? (
              <Link
                key={a.label}
                href={a.href}
                role="menuitem"
                className={classe}
                onClick={() => setAberto(false)}
              >
                {conteudo}
              </Link>
            ) : (
              <button
                key={a.label}
                type="button"
                role="menuitem"
                className={classe}
                onClick={() => {
                  setAberto(false);
                  a.onClick?.();
                }}
              >
                {conteudo}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
