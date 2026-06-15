"use client";

import { useState } from "react";
import type { ItemResultado, ResultadoChurrasco } from "@/core/tipos";
import { CATEGORIAS } from "@/data/cortes";
import ItemLinha from "@/components/ItemLinha";
import TabPills from "@/components/TabPills";

interface Tab {
  id: string;
  nome: string;
  emoji: string;
  itens: ItemResultado[];
}

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
      <TabPills
        abas={tabs.map((t) => ({
          id: t.id,
          nome: t.nome,
          emoji: t.emoji,
          count: t.itens.length,
        }))}
        ativa={ativaValida}
        onChange={setAtiva}
        ariaLabel="Itens do churrasco"
      />

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

  if (resultado.acompanhamentos.length > 0) {
    tabs.push({ id: "acompanhamento", nome: "Acompanhamentos", emoji: "🥗", itens: resultado.acompanhamentos });
  }
  if ((resultado.sobremesas ?? []).length > 0) {
    tabs.push({ id: "sobremesa", nome: "Sobremesas", emoji: "🍨", itens: resultado.sobremesas });
  }
  if (resultado.bebidas.length > 0) {
    tabs.push({ id: "bebida", nome: "Bebidas", emoji: "🥤", itens: resultado.bebidas });
  }

  return tabs;
}
