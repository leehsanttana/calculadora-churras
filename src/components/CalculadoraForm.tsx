"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Categoria, Duracao, EntradaChurrasco, Perfil } from "@/core/tipos";
import { entradaParaQuery, parseEntrada } from "@/core/serial";
import {
  CATEGORIAS,
  buscarCorte,
  cortesPorCategoria,
  ehRecomendado,
} from "@/data/cortes";
import { ACOMPANHAMENTOS } from "@/data/acompanhamentos";
import { BEBIDAS } from "@/data/bebidas";
import CorteImagem from "@/components/CorteImagem";
import TabPills from "@/components/TabPills";

const PERFIS: { valor: Perfil; titulo: string; descricao: string }[] = [
  { valor: "simples", titulo: "Simples", descricao: "Econômico e prático" },
  { valor: "intermediario", titulo: "Intermediário", descricao: "O churrasco clássico" },
  { valor: "sofisticado", titulo: "Sofisticado", descricao: "Para impressionar" },
];

const DURACOES: { valor: Duracao; titulo: string; descricao: string }[] = [
  { valor: "curto", titulo: "Curto", descricao: "até 3h" },
  { valor: "medio", titulo: "Médio", descricao: "3 a 5h" },
  { valor: "longo", titulo: "Longo", descricao: "mais de 5h" },
];

const TOTAL_ETAPAS = 4;

const ITENS_ACOMP = ACOMPANHAMENTOS.filter((a) => a.categoria === "acompanhamento");
const ITENS_SOBREMESA = ACOMPANHAMENTOS.filter((a) => a.categoria === "sobremesa");

// Itens recomendados por grupo (ganham só a tag "Recomendado" — não vêm marcados).
const RECOMENDADOS: Record<string, Set<string>> = {
  acompanhamento: new Set(["vinagrete", "farofa", "arroz"]),
  bebida: new Set(["refrigerante", "agua"]),
};

interface ItemSelecionavel {
  id: string;
  nome: string;
  emoji?: string;
  imagem?: string;
  recomendado?: boolean;
  aviso?: string;
}

/** Uma categoria/aba de seleção: seus itens, o conjunto selecionado e o toggle. */
interface CategoriaSelecao {
  id: string;
  nome: string;
  emoji: string;
  itens: ItemSelecionavel[];
  selecionados: Set<string>;
  /** Itens travados (já na lista, em modo edição) — não podem ser removidos. */
  bloqueados?: Set<string>;
  onToggle: (id: string) => void;
}

function toggleEm(setSet: Dispatch<SetStateAction<Set<string>>>, id: string) {
  setSet((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

export default function CalculadoraForm() {
  const router = useRouter();
  // Lê a entrada inicial da URL no cliente (permite export estático e o
  // "Ajustar" a partir do resultado prefilla o formulário).
  const searchParams = useSearchParams();
  const inicial = useMemo(
    () => parseEntrada(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  // Se viermos editando uma sala existente, mantemos o código na URL final.
  const salaCode = searchParams.get("sala") ?? undefined;
  const editando = !!salaCode;

  // Em modo edição, os itens já na lista ficam travados: o dono só pode
  // ADICIONAR novos (remover orfanaria os compromissos já marcados).
  const bloqueados = useMemo(() => {
    const cats = new Set<Categoria>();
    if (editando) {
      for (const id of inicial.cortes) {
        const c = buscarCorte(id);
        if (c) cats.add(c.categoria);
      }
    }
    return {
      cortes: new Set(editando ? inicial.cortes : []),
      acompanhamentos: new Set(editando ? inicial.acompanhamentos : []),
      sobremesas: new Set(editando ? inicial.sobremesas : []),
      bebidas: new Set(editando ? inicial.bebidas : []),
      categorias: cats,
    };
  }, [editando, inicial]);

  const [etapa, setEtapa] = useState(0);
  const [entrada, setEntrada] = useState<EntradaChurrasco>(inicial);

  const [categorias, setCategorias] = useState<Set<Categoria>>(() => {
    const s = new Set<Categoria>();
    for (const id of inicial.cortes) {
      const c = buscarCorte(id);
      if (c) s.add(c.categoria);
    }
    return s;
  });
  const [cortes, setCortes] = useState<Set<string>>(() => new Set(inicial.cortes));
  const [acompanhamentos, setAcompanhamentos] = useState<Set<string>>(
    () => new Set(inicial.acompanhamentos),
  );
  const [sobremesas, setSobremesas] = useState<Set<string>>(
    () => new Set(inicial.sobremesas),
  );
  const [bebidas, setBebidas] = useState<Set<string>>(() => new Set(inicial.bebidas));

  function set<K extends keyof EntradaChurrasco>(
    chave: K,
    valor: EntradaChurrasco[K],
  ) {
    setEntrada((e) => ({ ...e, [chave]: valor }));
  }

  function toggleCategoria(cat: Categoria) {
    if (bloqueados.categorias.has(cat)) return; // travada em modo edição
    const ligada = categorias.has(cat);
    setCategorias((prev) => {
      const next = new Set(prev);
      if (ligada) next.delete(cat);
      else next.add(cat);
      return next;
    });
    // Ao desmarcar a categoria, remove os cortes dela da seleção.
    if (ligada) {
      const ids = new Set(cortesPorCategoria(cat).map((c) => c.id));
      setCortes((prev) => new Set([...prev].filter((id) => !ids.has(id))));
    }
  }

  // Etapa 2 — cortes: uma aba por tipo de carne ESCOLHIDO (compartilham o Set cortes).
  const categoriasCarne: CategoriaSelecao[] = CATEGORIAS.filter((cat) =>
    categorias.has(cat.id),
  ).map((cat) => ({
    id: cat.id,
    nome: cat.nome,
    emoji: cat.emoji,
    itens: cortesPorCategoria(cat.id).map((corte) => ({
      id: corte.id,
      nome: corte.nome,
      emoji: corte.emoji,
      imagem: corte.imagem,
      recomendado: ehRecomendado(corte, entrada.perfil),
      aviso: `⚠ foge do estilo ${entrada.perfil} — pode não valer a pena`,
    })),
    selecionados: cortes,
    bloqueados: bloqueados.cortes,
    onToggle: (id) => {
      if (bloqueados.cortes.has(id)) return;
      toggleEm(setCortes, id);
    },
  }));

  // Etapa 3 — acompanhamentos, sobremesas e bebidas (cada um com seu Set).
  const categoriasExtras: CategoriaSelecao[] = [
    {
      id: "acompanhamento",
      nome: "Acompanhamentos",
      emoji: "🥗",
      itens: itensSimples(ITENS_ACOMP, RECOMENDADOS.acompanhamento),
      selecionados: acompanhamentos,
      bloqueados: bloqueados.acompanhamentos,
      onToggle: (id) => {
        if (bloqueados.acompanhamentos.has(id)) return;
        toggleEm(setAcompanhamentos, id);
      },
    },
    {
      id: "sobremesa",
      nome: "Sobremesas",
      emoji: "🍨",
      itens: itensSimples(ITENS_SOBREMESA),
      selecionados: sobremesas,
      bloqueados: bloqueados.sobremesas,
      onToggle: (id) => {
        if (bloqueados.sobremesas.has(id)) return;
        toggleEm(setSobremesas, id);
      },
    },
    {
      id: "bebida",
      nome: "Bebidas",
      emoji: "🥤",
      itens: itensSimples(BEBIDAS, RECOMENDADOS.bebida),
      selecionados: bebidas,
      bloqueados: bloqueados.bebidas,
      onToggle: (id) => {
        if (bloqueados.bebidas.has(id)) return;
        toggleEm(setBebidas, id);
      },
    },
  ];

  const podeAvancar =
    (etapa === 0 && entrada.adultos >= 1) ||
    (etapa === 1 && categorias.size > 0) ||
    (etapa === 2 && cortes.size > 0) ||
    etapa === 3;

  function avancar() {
    if (!podeAvancar) return;
    if (etapa < TOTAL_ETAPAS - 1) {
      setEtapa((e) => e + 1);
      return;
    }
    const payload: EntradaChurrasco = {
      ...entrada,
      cortes: [...cortes],
      acompanhamentos: [...acompanhamentos],
      sobremesas: [...sobremesas],
      bebidas: [...bebidas],
    };
    const query = entradaParaQuery(payload);
    router.push(`/resultado?${query}${salaCode ? `&sala=${salaCode}` : ""}`);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <ProgressoEtapas atual={etapa} total={TOTAL_ETAPAS} />

      {etapa === 0 && (
        <EtapaSobre
          entrada={entrada}
          set={set}
          perfis={PERFIS}
          duracoes={DURACOES}
          minimos={editando ? { adultos: inicial.adultos, criancas: inicial.criancas, contribuintes: inicial.contribuintes } : undefined}
        />
      )}
      {etapa === 1 && (
        <EtapaCategorias
          selecionadas={categorias}
          bloqueadas={bloqueados.categorias}
          onToggle={toggleCategoria}
        />
      )}
      {etapa === 2 && (
        <PassoSelecao
          instrucao="Escolha os cortes. Os recomendados combinam com o seu churrasco — mas você pode escolher o que quiser."
          categorias={categoriasCarne}
          avisoVazio={
            cortes.size === 0 ? (
              <p
                role="status"
                aria-live="polite"
                className="rounded-lg border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Selecione ao menos um corte para continuar.
              </p>
            ) : null
          }
        />
      )}
      {etapa === 3 && (
        <PassoSelecao
          instrucao="O que mais vai ter? Tudo aqui é opcional — marque o que você vai oferecer."
          categorias={categoriasExtras}
        />
      )}

      <div className="sticky bottom-0 flex gap-3 bg-background pt-3 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {etapa > 0 && (
          <button
            type="button"
            onClick={() => setEtapa((e) => e - 1)}
            className="rounded-full border border-black/15 px-6 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/20"
          >
            Voltar
          </button>
        )}
        <button
          type="button"
          onClick={avancar}
          disabled={!podeAvancar}
          className="flex-1 rounded-full border-2 border-foreground bg-primary px-8 py-3 font-semibold text-white shadow-pop-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {etapa === TOTAL_ETAPAS - 1 ? "Calcular churrasco 🔥" : "Avançar"}
        </button>
      </div>
    </div>
  );
}

/** Monta itens selecionáveis simples (acomp/sobremesa/bebida), com tag de recomendado. */
function itensSimples(
  base: { id: string; nome: string; emoji: string }[],
  recomendados?: Set<string>,
): ItemSelecionavel[] {
  return base.map((i) => ({
    id: i.id,
    nome: i.nome,
    emoji: i.emoji,
    recomendado: recomendados?.has(i.id) ?? false,
  }));
}

function ProgressoEtapas({ atual, total }: { atual: number; total: number }) {
  const titulos = [
    "Sobre o churrasco",
    "Tipos de carne",
    "Cortes",
    "Acompanhamentos e bebidas",
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-heading text-lg uppercase tracking-wide">
          {titulos[atual]}
        </span>
        <span className="font-mono text-xs text-foreground/50">
          Etapa {atual + 1} de {total}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= atual ? "bg-primary" : "bg-black/10 dark:bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function EtapaSobre({
  entrada,
  set,
  perfis,
  duracoes,
  minimos,
}: {
  entrada: EntradaChurrasco;
  set: <K extends keyof EntradaChurrasco>(
    chave: K,
    valor: EntradaChurrasco[K],
  ) => void;
  perfis: typeof PERFIS;
  duracoes: typeof DURACOES;
  /** Em edição, pessoas/contribuintes só podem aumentar (mínimo = atual). */
  minimos?: { adultos: number; criancas: number; contribuintes: number };
}) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Quem vai
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <Contador
            label="Adultos"
            valor={entrada.adultos}
            min={Math.max(1, minimos?.adultos ?? 1)}
            onChange={(v) => set("adultos", v)}
          />
          <Contador
            label="Crianças"
            valor={entrada.criancas}
            min={minimos?.criancas ?? 0}
            onChange={(v) => set("criancas", v)}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Rateio
        </legend>
        <Contador
          label="Quantos vão contribuir / dividir as compras"
          valor={entrada.contribuintes}
          min={Math.max(1, minimos?.contribuintes ?? 1)}
          onChange={(v) => set("contribuintes", v)}
        />
        <p className="text-xs text-black/50 dark:text-white/50">
          Usamos isso para mostrar quanto cada um traz no resultado.
        </p>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Tipo de churrasco
        </legend>
        <div className="flex flex-col gap-3">
          {perfis.map((p) => (
            <Opcao
              key={p.valor}
              nome="perfil"
              titulo={p.titulo}
              descricao={p.descricao}
              selecionado={entrada.perfil === p.valor}
              onSelect={() => set("perfil", p.valor)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Duração
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {duracoes.map((d) => (
            <Opcao
              key={d.valor}
              nome="duracao"
              titulo={d.titulo}
              descricao={d.descricao}
              selecionado={entrada.duracao === d.valor}
              onSelect={() => set("duracao", d.valor)}
              compacto
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/** Card de instrução — contraste menor que os cards de item selecionáveis. */
function InstrucaoCard({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-black/4 px-4 py-3 text-sm text-foreground/55 dark:bg-white/4">
      {children}
    </p>
  );
}

/** Etapa 1 — escolha dos tipos de carne (define quais abas aparecem nos cortes). */
function EtapaCategorias({
  selecionadas,
  bloqueadas,
  onToggle,
}: {
  selecionadas: Set<Categoria>;
  bloqueadas?: Set<Categoria>;
  onToggle: (c: Categoria) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <InstrucaoCard>
        Com quais tipos de carne você quer trabalhar? A quantidade será dividida
        entre os tipos escolhidos — você seleciona os cortes na próxima etapa.
      </InstrucaoCard>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIAS.map((cat) => {
          const ativo = selecionadas.has(cat.id);
          const travada = bloqueadas?.has(cat.id) ?? false;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggle(cat.id)}
              aria-pressed={ativo}
              disabled={travada}
              title={travada ? "Já na lista — não pode ser removido" : undefined}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                ativo
                  ? "border-primary bg-primary-soft"
                  : "bg-surface border-black/10 hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
              } ${travada ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <span className="text-2xl" aria-hidden>
                {cat.emoji}
              </span>
              <span className="font-medium">{cat.nome}</span>
              {travada && <span className="ml-auto text-xs" aria-hidden>🔒</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Etapa de seleção com uma aba por categoria (cortes, ou acomp/sobremesa/bebida). */
function PassoSelecao({
  instrucao,
  categorias,
  avisoVazio,
}: {
  instrucao: string;
  categorias: CategoriaSelecao[];
  avisoVazio?: React.ReactNode;
}) {
  const [aba, setAba] = useState<string | undefined>(categorias[0]?.id);
  const abaValida = categorias.find((c) => c.id === aba) ? aba : categorias[0]?.id;
  const ativa = categorias.find((c) => c.id === abaValida);

  return (
    <div className="flex flex-col gap-4">
      <InstrucaoCard>{instrucao}</InstrucaoCard>
      {avisoVazio}

      <TabPills
        abas={categorias.map((c) => ({
          id: c.id,
          nome: c.nome,
          emoji: c.emoji,
          count: c.itens.filter((i) => c.selecionados.has(i.id)).length,
        }))}
        ativa={abaValida}
        onChange={setAba}
      />

      {ativa && (
        <div className="flex flex-col gap-3">
          {ativa.itens.map((item) => (
            <ItemCheck
              key={item.id}
              item={item}
              ativo={ativa.selecionados.has(item.id)}
              bloqueado={ativa.bloqueados?.has(item.id) ?? false}
              onToggle={() => ativa.onToggle(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Linha de item selecionável (corte, acompanhamento, bebida…). */
function ItemCheck({
  item,
  ativo,
  bloqueado = false,
  onToggle,
}: {
  item: ItemSelecionavel;
  ativo: boolean;
  bloqueado?: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border p-2.5 transition focus-within:ring-2 focus-within:ring-primary ${
        bloqueado ? "cursor-default" : "cursor-pointer"
      } ${
        ativo
          ? "border-primary bg-primary-soft"
          : "bg-surface border-black/10 hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
      }`}
    >
      <input
        type="checkbox"
        checked={ativo}
        disabled={bloqueado}
        onChange={onToggle}
        className="sr-only"
      />
      <CorteImagem
        emoji={item.emoji}
        imagem={item.imagem}
        nome={item.nome}
        tamanho={40}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium">{item.nome}</span>
        {bloqueado ? (
          <span className="text-[10px] text-foreground/45">Já na lista</span>
        ) : item.recomendado ? (
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary-text">
            Recomendado
          </span>
        ) : (
          item.aviso &&
          ativo && (
            <span className="text-[10px] text-amber-600 dark:text-amber-500">
              {item.aviso}
            </span>
          )
        )}
      </span>
      {bloqueado ? (
        <span className="shrink-0 text-xs" aria-hidden>🔒</span>
      ) : (
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-md border text-xs ${
            ativo
              ? "border-primary bg-primary text-white"
              : "border-black/25 dark:border-white/30"
          }`}
          aria-hidden
        >
          {ativo ? "✓" : ""}
        </span>
      )}
    </label>
  );
}

function Contador({
  label,
  valor,
  min,
  onChange,
}: {
  label: string;
  valor: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 rounded-xl border border-black/10 bg-surface p-3 focus-within:ring-2 focus-within:ring-primary dark:border-white/15">
      <span className="text-sm text-black/60 dark:text-white/60">{label}</span>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={`Diminuir ${label}`}
          onClick={() => onChange(Math.max(min, valor - 1))}
          className="flex size-11 items-center justify-center rounded-full border border-black/15 text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/20"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          autoComplete="off"
          min={min}
          value={valor}
          onChange={(e) =>
            onChange(Math.max(min, Number(e.target.value) || min))
          }
          className="w-12 bg-transparent text-center text-xl font-semibold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          onClick={() => onChange(valor + 1)}
          className="flex size-11 items-center justify-center rounded-full border border-black/15 text-xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/20"
        >
          +
        </button>
      </div>
    </label>
  );
}

function Opcao({
  nome,
  titulo,
  descricao,
  selecionado,
  onSelect,
  compacto = false,
}: {
  nome: string;
  titulo: string;
  descricao: string;
  selecionado: boolean;
  onSelect: () => void;
  compacto?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 transition focus-within:ring-2 focus-within:ring-primary ${
        selecionado
          ? "border-primary bg-primary-soft"
          : "bg-surface border-black/10 hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
      } ${compacto ? "text-center" : ""}`}
    >
      <input
        type="radio"
        name={nome}
        checked={selecionado}
        onChange={onSelect}
        className="sr-only"
      />
      <span className="font-medium">{titulo}</span>
      <span className="text-xs text-black/55 dark:text-white/55">
        {descricao}
      </span>
    </label>
  );
}
