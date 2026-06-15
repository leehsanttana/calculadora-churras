"use client";

import { useState } from "react";
import type { ItemResultado, ResultadoChurrasco } from "@/core/tipos";
import { CATEGORIAS } from "@/data/cortes";
import { ACOMPANHAMENTOS } from "@/data/acompanhamentos";
import ItemLinha from "@/components/ItemLinha";

interface Tab {
  id: string;
  nome: string;
  emoji: string;
  itens: ItemResultado[];
}

const SOBREMESA_IDS = new Set(
  ACOMPANHAMENTOS.filter((a) => a.categoria === "sobremesa").map((a) => a.id),
);

/**
 * Resultado em guias (tabs): uma aba por categoria presente — tipos de carne,
 * extras da grelha, acompanhamentos, sobremesas e bebidas. Espelha a etapa de
 * seleção do wizard.
 */
export default function ResultadoTabs({
  resultado,
}: {
  resultado: ResultadoChurrasco;
}) {
  const tabs = montarTabs(resultado);
  const [ativa, setAtiva] = useState<string | undefined>(tabs[0]?.id);

  if (tabs.length === 0) return null;

  const ativaValida = tabs.find((t) => t.id === ativa) ? ativa : tabs[0]?.id;
  const tabAtiva = tabs.find((t) => t.id === ativaValida);

  return (
    <section className="flex flex-col gap-3">
      <div role="tablist" aria-label="Itens do churrasco" className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const sel = t.id === ativaValida;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setAtiva(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                sel
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-black/10 bg-surface hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
              }`}
            >
              <span aria-hidden>{t.emoji}</span> {t.nome}
              <span
                className={`rounded-full px-1.5 text-xs font-bold ${
                  sel ? "bg-white/25" : "bg-primary/15 text-primary-text"
                }`}
              >
                {t.itens.length}
              </span>
            </button>
          );
        })}
      </div>

      {tabAtiva && (
        <ul className="flex flex-col gap-3">
          {tabAtiva.itens.map((item) => (
            <ItemLinha key={`${item.nome}|${item.unidade}`} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

/** Monta as abas presentes, na ordem canônica (carnes → grelha → resto). */
function montarTabs(resultado: ResultadoChurrasco): Tab[] {
  const tabs: Tab[] = [];

  // Tipos de carne (e extras da grelha) na ordem do catálogo.
  for (const cat of CATEGORIAS) {
    const itens =
      cat.id === "extras"
        ? resultado.extras
        : resultado.carnes.filter((c) => c.categoria === cat.id);
    if (itens.length > 0) {
      tabs.push({ id: cat.id, nome: cat.nome, emoji: cat.emoji, itens });
    }
  }

  // Acompanhamentos e sobremesas vêm juntos em resultado.acompanhamentos;
  // separamos pela categoria de origem do item.
  const acompanhamentos = resultado.acompanhamentos.filter(
    (i) => !i.id || !SOBREMESA_IDS.has(i.id),
  );
  const sobremesas = resultado.acompanhamentos.filter(
    (i) => i.id && SOBREMESA_IDS.has(i.id),
  );

  if (acompanhamentos.length > 0) {
    tabs.push({ id: "acompanhamento", nome: "Acompanhamentos", emoji: "🥗", itens: acompanhamentos });
  }
  if (sobremesas.length > 0) {
    tabs.push({ id: "sobremesa", nome: "Sobremesas", emoji: "🍨", itens: sobremesas });
  }
  if (resultado.bebidas.length > 0) {
    tabs.push({ id: "bebida", nome: "Bebidas", emoji: "🥤", itens: resultado.bebidas });
  }

  return tabs;
}
