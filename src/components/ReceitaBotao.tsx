"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Receita } from "@/core/tipos";
import { buscarReceitas } from "@/data/receitas";

/**
 * Botão "Modo de preparo" que abre um modal com duas receitas do item:
 * a padrão (simples) e a "para impressionar". Não renderiza nada se o item
 * não tiver receita cadastrada.
 */
export default function ReceitaBotao({
  id,
  nome,
}: {
  id?: string;
  nome: string;
}) {
  const receitas = buscarReceitas(id);
  const [aberto, setAberto] = useState(false);
  const [aba, setAba] = useState<"padrao" | "impressionar">("padrao");
  const fecharRef = useRef<HTMLButtonElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const abaId = (k: "padrao" | "impressionar") => `${baseId}-${k}`;
  const painelId = `${baseId}-painel`;

  function onSetaAba(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const proxima = aba === "padrao" ? "impressionar" : "padrao";
    setAba(proxima);
    document.getElementById(abaId(proxima))?.focus();
  }

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", onKey);
    // Trava o scroll do fundo e leva o foco para dentro do diálogo.
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fecharRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAnterior;
      gatilhoRef.current?.focus(); // devolve o foco a quem abriu
    };
  }, [aberto]);

  if (!receitas) return null;

  const receita = receitas[aba];

  return (
    <>
      <button
        ref={gatilhoRef}
        type="button"
        onClick={() => setAberto(true)}
        className="mt-2 inline-flex items-center gap-1 rounded-full border border-black/15 px-3 py-2 text-xs font-medium text-black/70 transition-colors hover:border-primary hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/20 dark:text-white/70"
      >
        👨‍🍳 Modo de preparo
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Modo de preparo: ${nome}`}
          onClick={() => setAberto(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-surface shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-black/10 p-4 dark:border-white/10">
              <h3 className="font-heading text-2xl uppercase">{nome}</h3>
              <button
                ref={fecharRef}
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="flex size-11 items-center justify-center rounded-full text-black/50 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white/50 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </header>

            <div
              role="tablist"
              aria-label="Versões da receita"
              className="flex gap-1 p-2"
              onKeyDown={onSetaAba}
            >
              <Aba
                id={abaId("padrao")}
                controla={painelId}
                ativo={aba === "padrao"}
                onClick={() => setAba("padrao")}
              >
                Padrão
              </Aba>
              <Aba
                id={abaId("impressionar")}
                controla={painelId}
                ativo={aba === "impressionar"}
                onClick={() => setAba("impressionar")}
              >
                ✨ Para impressionar
              </Aba>
            </div>

            <div
              id={painelId}
              role="tabpanel"
              aria-labelledby={abaId(aba)}
              tabIndex={0}
              className="overflow-y-auto overscroll-contain px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)] focus-visible:outline-none"
            >
              <ReceitaConteudo receita={receita} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Aba({
  id,
  controla,
  ativo,
  onClick,
  children,
}: {
  id: string;
  controla: string;
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={ativo}
      aria-controls={controla}
      tabIndex={ativo ? 0 : -1}
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        ativo
          ? "bg-primary text-white"
          : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function ReceitaConteudo({ receita }: { receita: Receita }) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <h4 className="font-semibold">{receita.titulo}</h4>
        {receita.tempo && (
          <p className="text-xs text-black/50 dark:text-white/50">
            ⏱ {receita.tempo}
          </p>
        )}
      </div>

      <div>
        <h5 className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Ingredientes
        </h5>
        <ul className="flex flex-col gap-1">
          {receita.ingredientes.map((ing) => (
            <li key={ing} className="flex gap-2 text-sm">
              <span className="text-primary-text">•</span>
              {ing}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Preparo
        </h5>
        <ol className="flex flex-col gap-2">
          {receita.passos.map((passo, i) => (
            <li key={passo} className="flex gap-2 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              {passo}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
