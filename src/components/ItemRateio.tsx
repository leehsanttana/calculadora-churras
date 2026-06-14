"use client";

import { useEffect, useRef, useState } from "react";
import type { CompromissoSala, ItemResultado, SessaoSala } from "@/core/tipos";
import { formatarQuantidade } from "@/core/formato";
import CorteImagem from "@/components/CorteImagem";

interface Props {
  item: ItemResultado;
  salaCode: string;
  sessao: SessaoSala;
  compromissos: CompromissoSala[];
  encerrada: boolean;
  isHost: boolean;
  onAtualizar: () => void;
  onRemoverCompromisso?: (participanteId: string, itemChave: string) => void;
}

function chave(item: ItemResultado) {
  return `${item.nome}|${item.unidade}`;
}

function totalComprometido(compromissos: CompromissoSala[], itemChave: string) {
  return compromissos
    .filter((c) => c.itemChave === itemChave)
    .reduce((s, c) => s + c.quantidade, 0);
}

export default function ItemRateio({
  item,
  salaCode,
  sessao,
  compromissos,
  encerrada,
  isHost,
  onAtualizar,
  onRemoverCompromisso,
}: Props) {
  const itemChave = chave(item);
  const meuCompromisso = compromissos.find(
    (c) => c.itemChave === itemChave && c.participanteId === sessao.participanteId,
  );
  const outrosCompromissos = compromissos.filter(
    (c) => c.itemChave === itemChave && c.participanteId !== sessao.participanteId,
  );

  const comprometido = totalComprometido(compromissos, itemChave);
  const restante = Math.max(0, item.quantidade - comprometido);
  const coberto = comprometido >= item.quantidade;

  const [qtd, setQtd] = useState(meuCompromisso?.quantidade ?? 0);
  const [salvando, setSalvando] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza se o estado externo mudar (polling)
  useEffect(() => {
    setQtd(meuCompromisso?.quantidade ?? 0);
  }, [meuCompromisso?.quantidade]);

  function onChange(valor: number) {
    const v = Math.max(0, valor);
    setQtd(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => salvar(v), 600);
  }

  async function salvar(valor: number) {
    setSalvando(true);
    try {
      await fetch(`/api/salas/${salaCode}/compromissos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participanteId: sessao.participanteId,
          itemChave,
          itemNome: item.nome,
          quantidade: valor,
          unidade: item.unidade,
        }),
      });
      onAtualizar();
    } finally {
      setSalvando(false);
    }
  }

  const step = item.unidade === "kg" ? 0.5 : 1;

  return (
    <li className={`flex flex-col gap-3 rounded-xl border p-3 transition ${
      coberto
        ? "border-primary/30 bg-primary-soft"
        : "border-black/10 bg-surface dark:border-white/15"
    }`}>
      {/* Linha principal */}
      <div className="flex items-center gap-3">
        <CorteImagem emoji={item.emoji} imagem={item.imagem} nome={item.nome} tamanho={40} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold">{item.nome}</span>
          <span className="text-xs text-foreground/55">
            Total: {formatarQuantidade(item)}
            {coberto && <span className="ml-1 font-medium text-primary-text">✓ coberto</span>}
            {!coberto && comprometido > 0 && (
              <span className="ml-1 text-amber-600 dark:text-amber-400">
                · falta {restante.toFixed(item.unidade === "kg" ? 1 : 0)} {item.unidade}
              </span>
            )}
          </span>
        </div>

        {/* Input do participante */}
        {!encerrada && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Diminuir"
              onClick={() => onChange(Math.max(0, qtd - step))}
              className="flex size-8 items-center justify-center rounded-full border border-black/15 text-lg leading-none dark:border-white/20"
            >−</button>
            <span className="w-12 text-center text-sm font-semibold tabular-nums">
              {qtd > 0 ? `${qtd}${item.unidade}` : "—"}
            </span>
            <button
              type="button"
              aria-label="Aumentar"
              onClick={() => onChange(qtd + step)}
              className="flex size-8 items-center justify-center rounded-full border border-black/15 text-lg leading-none dark:border-white/20"
            >+</button>
            {salvando && <span className="ml-1 text-xs text-foreground/40">…</span>}
          </div>
        )}
      </div>

      {/* Quem está levando */}
      {compromissos.filter((c) => c.itemChave === itemChave).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {compromissos
            .filter((c) => c.itemChave === itemChave)
            .map((c) => (
              <span
                key={c.participanteId}
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  c.participanteId === sessao.participanteId
                    ? "bg-primary text-white"
                    : "bg-black/8 dark:bg-white/10"
                }`}
              >
                {c.participanteNome} · {c.quantidade}{c.unidade}
                {isHost && c.participanteId !== sessao.participanteId && onRemoverCompromisso && (
                  <button
                    type="button"
                    aria-label={`Remover compromisso de ${c.participanteNome}`}
                    onClick={() => onRemoverCompromisso(c.participanteId, c.itemChave)}
                    className="ml-0.5 text-[10px] opacity-60 hover:opacity-100"
                  >✕</button>
                )}
              </span>
            ))}
        </div>
      )}

      {outrosCompromissos.length === 0 && !meuCompromisso && !encerrada && (
        <p className="text-xs text-foreground/40">Ninguém assumiu esse item ainda.</p>
      )}
    </li>
  );
}
