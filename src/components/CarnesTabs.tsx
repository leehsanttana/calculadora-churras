"use client";

import { useState } from "react";
import type { Categoria, ItemResultado } from "@/core/tipos";
import { CATEGORIAS } from "@/data/cortes";
import ItemLinha from "@/components/ItemLinha";

/** Carnes do resultado em guias (tabs) por categoria. */
export default function CarnesTabs({ itens }: { itens: ItemResultado[] }) {
  // Categorias presentes, na ordem do catálogo.
  const presentes = CATEGORIAS.filter((c) =>
    itens.some((i) => i.categoria === c.id),
  );
  const [ativa, setAtiva] = useState<Categoria | undefined>(presentes[0]?.id);

  if (itens.length === 0) return null;

  const ativaValida = presentes.find((c) => c.id === ativa)
    ? ativa
    : presentes[0]?.id;
  const visiveis = itens.filter((i) => i.categoria === ativaValida);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-heading text-xl uppercase tracking-wide">
        <span aria-hidden>🥩</span> Carnes
      </h2>

      {presentes.length > 1 && (
        <div
          role="tablist"
          aria-label="Tipos de carne"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {presentes.map((c) => {
            const sel = c.id === ativaValida;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={sel}
                onClick={() => setAtiva(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  sel
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-black/10 bg-surface hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
                }`}
              >
                <span aria-hidden>{c.emoji}</span> {c.nome}
              </button>
            );
          })}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {visiveis.map((item) => (
          <ItemLinha key={item.nome} item={item} />
        ))}
      </ul>
    </section>
  );
}
