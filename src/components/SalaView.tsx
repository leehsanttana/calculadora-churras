"use client";

import Link from "next/link";
import type { EstadoSala, ItemResultado, SessaoSala } from "@/core/tipos";
import { formatarPesoKg } from "@/core/formato";
import ItemRateio from "@/components/ItemRateio";
import ResultadoTabs from "@/components/ResultadoTabs";
import BotaoVoltar from "@/components/BotaoVoltar";
import DicasFogo from "@/components/DicasFogo";
import Toast, { useToast } from "@/components/Toast";
import MenuAcoes, { type AcaoMenu } from "@/components/MenuAcoes";

interface Props {
  sala: EstadoSala;
  /** Sessão do dispositivo. Pode ser nula para quem só visualiza uma lista pessoal. */
  sessao: SessaoSala | null;
  /** Anfitrião exclui a lista/sala (encerra no servidor e some daqui). */
  onExcluir?: () => void;
  onRemoverCompromisso?: (participanteId: string, itemChave: string) => void;
  onAtualizar: () => void;
  /** Anfitrião transforma a lista pessoal em sala de rateio. */
  onDividir?: () => void;
  /** Destaca o "dividir com a galera" (ex.: há mais de 1 contribuinte). */
  sugerirDividir?: boolean;
  /** Link para reabrir a calculadora editando esta lista (só anfitrião). */
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

export default function SalaView({
  sala,
  sessao,
  onExcluir,
  onRemoverCompromisso,
  onAtualizar,
  onDividir,
  sugerirDividir,
  linkEditar,
}: Props) {
  const isHost = !!sessao?.hostToken;
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

  const { estado: toast, mostrar: mostrarToast } = useToast();

  function copiarLink() {
    const url = `${window.location.origin}/sala?code=${sala.code}`;
    navigator.clipboard
      .writeText(url)
      .then(() => mostrarToast("🔗 Link copiado!"))
      .catch(() => {});
  }

  const colaborativa = sala.colaborativa;
  // Só quem entrou (tem sessão) participa do rateio; os demais apenas visualizam.
  const ehParticipante = !!sessao;

  // Ações do anfitrião (3 pontinhos, ao lado do compartilhar).
  const acoesLista: AcaoMenu[] = [];
  if (linkEditar) {
    acoesLista.push({ label: "Editar lista", icone: "✏️", href: linkEditar });
  }
  if (onExcluir) {
    acoesLista.push({ label: "Excluir", icone: "🗑️", perigo: true, onClick: onExcluir });
  }
  const mostrarMenu = isHost && !sala.encerrada && acoesLista.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <BotaoVoltar fallback="/meus-churrascos" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copiarLink}
            className="text-sm font-medium text-primary-text hover:underline"
          >
            Copiar link
          </button>
          {mostrarMenu && <MenuAcoes acoes={acoesLista} rotulo="Ações da lista" />}
        </div>
      </header>

      {/* Cabeçalho da lista/sala */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-accent bg-primary p-5 text-white shadow-pop">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">
              {colaborativa ? "Sala de rateio" : "Lista do churrasco"}
            </p>
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

        {colaborativa ? (
          /* Barra de progresso do rateio */
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
        ) : (
          resultado.totalCompraKg > 0 && (
            <p className="mt-4 border-t border-white/20 pt-3 text-sm opacity-90">
              🥩 Total: <span className="font-semibold">{formatarPesoKg(resultado.totalCompraKg)}</span> de carne
            </p>
          )
        )}
      </div>

      {/* Participantes (só no modo colaborativo) */}
      {colaborativa && participantes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participantes.map((p) => (
            <span
              key={p.id}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                p.id === sessao?.participanteId
                  ? "bg-primary text-white"
                  : "bg-black/8 dark:bg-white/10"
              }`}
            >
              {p.nome} {p.id === sessao?.participanteId && "(você)"}
            </span>
          ))}
        </div>
      )}

      {sala.encerrada && (
        <div className="rounded-xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-300">
          Esta sala foi encerrada pelo anfitrião. A lista não pode ser mais editada.
        </div>
      )}

      {/* Aviso de somente leitura: lista pessoal compartilhada ou sala já cheia */}
      {!ehParticipante && (
        <div className="rounded-xl border border-black/10 bg-surface px-4 py-3 text-sm text-foreground/70 dark:border-white/15">
          {colaborativa
            ? "🙌 Esta sala já atingiu o número de pessoas no rateio — você pode visualizar a lista."
            : "👀 Você está vendo uma lista compartilhada — somente para visualização."}
        </div>
      )}

      {colaborativa && ehParticipante ? (
        <>
          {/* Listas de itens — modo rateio (cada um marca o que leva) */}
          <SecaoRateio titulo="Carnes" emoji="🥩" itens={resultado.carnes}
            sala={sala} sessao={sessao!} isHost={isHost}
            onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
          <SecaoRateio titulo="Extras da grelha" emoji="🧀" itens={resultado.extras}
            sala={sala} sessao={sessao!} isHost={isHost}
            onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
          <SecaoRateio titulo="Acompanhamentos" emoji="🥗" itens={resultado.acompanhamentos}
            sala={sala} sessao={sessao!} isHost={isHost}
            onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
          <SecaoRateio titulo="Bebidas" emoji="🥤" itens={resultado.bebidas}
            sala={sala} sessao={sessao!} isHost={isHost}
            onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
          <SecaoRateio titulo="Sobremesas" emoji="🍨" itens={sobremesas}
            sala={sala} sessao={sessao!} isHost={isHost}
            onAtualizar={onAtualizar} onRemoverCompromisso={onRemoverCompromisso} />
        </>
      ) : (
        /* Lista pessoal — visualização (mesmas abas do resultado) */
        <ResultadoTabs resultado={resultado} />
      )}

      {/* Lista pessoal: oferecer transformar em sala de rateio (CTA principal) */}
      {isHost && !sala.encerrada && !colaborativa && onDividir && (
        <div className="flex flex-col gap-2">
          {sugerirDividir && (
            <p className="rounded-lg bg-accent/25 px-3 py-2 text-xs font-medium text-foreground/80">
              🤝 Mais de uma pessoa no rateio? Divida com a galera para cada um
              marcar o que vai levar.
            </p>
          )}
          <button
            type="button"
            onClick={onDividir}
            className="rounded-full border-2 border-foreground bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white shadow-pop-sm transition-colors hover:bg-primary-hover"
          >
            Dividir com a galera 🤝
          </button>
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

      {/* Quem não é o dono (visitante ou participante): convite forte a criar a sua. */}
      {!isHost ? (
        <Link
          href="/calcular"
          className="rounded-full border-2 border-foreground bg-primary px-8 py-3 text-center font-semibold text-white shadow-pop transition-transform hover:-translate-y-0.5"
        >
          Criar minha própria lista 🔥
        </Link>
      ) : (
        <Link
          href="/calcular"
          className="text-center text-sm font-medium text-primary-text hover:underline"
        >
          + Nova lista
        </Link>
      )}

      <p className="text-center text-xs text-foreground/40">
        {colaborativa
          ? "Atualiza automaticamente a cada 4s · Sala expira em 7 dias"
          : "Lista expira em 7 dias"}
      </p>

      <Toast estado={toast} />
    </main>
  );
}
