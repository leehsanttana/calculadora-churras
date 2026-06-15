"use client";

import Link from "next/link";
import type { EstadoSala, ItemResultado, SessaoSala } from "@/core/tipos";
import ItemRateio from "@/components/ItemRateio";
import BotaoVoltar from "@/components/BotaoVoltar";
import DicasFogo from "@/components/DicasFogo";

interface Props {
  sala: EstadoSala;
  sessao: SessaoSala;
  onEncerrar?: () => void;
  onRemoverCompromisso?: (participanteId: string, itemChave: string) => void;
  onAtualizar: () => void;
  /** Link para reabrir a calculadora editando esta sala (só anfitrião). */
  linkEditar?: string;
}

function SecaoRateio({
  titulo,
  emoji,
  itens,
  sala,
  sessao,
  isHost,
  onAtualizar,
  onRemoverCompromisso,
}: {
  titulo: string;
  emoji: string;
  itens: ItemResultado[];
  sala: EstadoSala;
  sessao: SessaoSala;
  isHost: boolean;
  onAtualizar: () => void;
  onRemoverCompromisso?: (participanteId: string, itemChave: string) => void;
}) {
  if (itens.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-heading text-xl uppercase tracking-wide">
        <span aria-hidden>{emoji}</span> {titulo}
      </h2>
      <ul className="flex flex-col gap-3">
        {itens.map((item) => (
          <ItemRateio
            key={`${item.nome}|${item.unidade}`}
            item={item}
            salaCode={sala.code}
            sessao={sessao}
            compromissos={sala.compromissos}
            encerrada={sala.encerrada}
            isHost={isHost}
            onAtualizar={onAtualizar}
            onRemoverCompromisso={onRemoverCompromisso}
          />
        ))}
      </ul>
    </section>
  );
}

export default function SalaView({ sala, sessao, onEncerrar, onRemoverCompromisso, onAtualizar, linkEditar }: Props) {
  const isHost = !!sessao.hostToken;
  const { resultado, compromissos, participantes } = sala;
  // Salas antigas (criadas antes do split) podem não ter `sobremesas`.
  const sobremesas = resultado.sobremesas ?? [];

  const todosItens = [
    ...resultado.carnes,
    ...resultado.extras,
    ...resultado.acompanhamentos,
    ...sobremesas,
    ...resultado.bebidas,
  ];

  const totalItens = todosItens.length;
  const itensCobertos = todosItens.filter((item) => {
    const chave = `${item.nome}|${item.unidade}`;
    const comprometido = compromissos
      .filter((c) => c.itemChave === chave)
      .reduce((s, c) => s + c.quantidade, 0);
    return comprometido >= item.quantidade;
  }).length;

  function copiarLink() {
    const url = `${window.location.origin}/sala?code=${sala.code}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <BotaoVoltar fallback="/meus-churrascos" />
        <button
          type="button"
          onClick={copiarLink}
          className="text-sm font-medium text-primary-text hover:underline"
        >
          Copiar link
        </button>
      </header>

      {/* Cabeçalho da sala */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-accent bg-primary p-5 text-white shadow-pop">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">Sala de rateio</p>
            <h1 className="font-heading text-3xl uppercase leading-tight">{sala.nome}</h1>
            <p className="mt-1 text-sm opacity-80">
              Código: <span className="font-mono font-bold tracking-widest">{sala.code}</span>
            </p>
          </div>
          {sala.encerrada && (
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase">
              Encerrada
            </span>
          )}
        </div>

        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-80">
            <span>{itensCobertos} de {totalItens} itens cobertos</span>
            <span>{participantes.length} participante(s)</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: totalItens > 0 ? `${(itensCobertos / totalItens) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Participantes */}
      {participantes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participantes.map((p) => (
            <span
              key={p.id}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                p.id === sessao.participanteId
                  ? "bg-primary text-white"
                  : "bg-black/8 dark:bg-white/10"
              }`}
            >
              {p.nome} {p.id === sessao.participanteId && "(você)"}
            </span>
          ))}
        </div>
      )}

      {sala.encerrada && (
        <div className="rounded-xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-300">
          Esta sala foi encerrada pelo anfitrião. A lista não pode ser mais editada.
        </div>
      )}

      {/* Listas de itens */}
      <SecaoRateio titulo="Carnes" emoji="🥩" itens={resultado.carnes}
        sala={sala} sessao={sessao} isHost={isHost}
        onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
      <SecaoRateio titulo="Extras da grelha" emoji="🧀" itens={resultado.extras}
        sala={sala} sessao={sessao} isHost={isHost}
        onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
      <SecaoRateio titulo="Acompanhamentos" emoji="🥗" itens={resultado.acompanhamentos}
        sala={sala} sessao={sessao} isHost={isHost}
        onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
      <SecaoRateio titulo="Sobremesas" emoji="🍨" itens={sobremesas}
        sala={sala} sessao={sessao} isHost={isHost}
        onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
      <SecaoRateio titulo="Bebidas" emoji="🥤" itens={resultado.bebidas}
        sala={sala} sessao={sessao} isHost={isHost}
        onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />

      {/* Ações do anfitrião */}
      {isHost && !sala.encerrada && (
        <div className="flex flex-col gap-2">
          {linkEditar && (
            <Link
              href={linkEditar}
              className="rounded-full border-2 border-foreground bg-surface px-6 py-2.5 text-center text-sm font-semibold shadow-pop-sm transition-colors hover:bg-primary-soft dark:bg-transparent"
            >
              ✏️ Editar lista
            </Link>
          )}
          {onEncerrar && (
            <button
              type="button"
              onClick={onEncerrar}
              className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Encerrar sala
            </button>
          )}
        </div>
      )}

      {/* Dica da churrasqueira — agora dentro da sala (página salva) */}
      <details className="group rounded-xl border border-black/10 bg-surface p-3 dark:border-white/15">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400">
          <span className="transition group-open:rotate-90">›</span>
          🔥 Como acender a churrasqueira
        </summary>
        <div className="mt-3">
          <DicasFogo />
        </div>
      </details>

      <Link
        href="/calcular"
        className="text-center text-sm font-medium text-primary-text hover:underline"
      >
        + Nova lista
      </Link>

      <p className="text-center text-xs text-foreground/40">
        Atualiza automaticamente a cada 4s · Sala expira em 7 dias
      </p>
    </main>
  );
}
