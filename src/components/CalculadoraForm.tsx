"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  Categoria,
  Duracao,
  EntradaChurrasco,
  Perfil,
} from "@/core/tipos";
import { entradaParaQuery, parseEntrada } from "@/core/serial";
import {
  CATEGORIAS,
  buscarCorte,
  cortesPorCategoria,
  ehRecomendado,
} from "@/data/cortes";
import CorteImagem from "@/components/CorteImagem";

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

export default function CalculadoraForm() {
  const router = useRouter();
  // Lê a entrada inicial da URL no cliente (permite export estático e o
  // "Ajustar" a partir do resultado prefilla o formulário).
  const searchParams = useSearchParams();
  const inicial = useMemo(
    () => parseEntrada(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const [etapa, setEtapa] = useState(0);
  const [entrada, setEntrada] = useState<EntradaChurrasco>(inicial);

  const [cortes, setCortes] = useState<Set<string>>(
    () => new Set(inicial.cortes),
  );
  const [categorias, setCategorias] = useState<Set<Categoria>>(() => {
    const set = new Set<Categoria>();
    for (const id of inicial.cortes) {
      const corte = buscarCorte(id);
      if (corte) set.add(corte.categoria);
    }
    return set;
  });

  function set<K extends keyof EntradaChurrasco>(
    chave: K,
    valor: EntradaChurrasco[K],
  ) {
    setEntrada((e) => ({ ...e, [chave]: valor }));
  }

  function toggleCategoria(cat: Categoria) {
    setCategorias((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
        // ao desmarcar a categoria, remove os cortes dela
        setCortes((cs) => {
          const ncs = new Set(cs);
          for (const id of cs) {
            if (buscarCorte(id)?.categoria === cat) ncs.delete(id);
          }
          return ncs;
        });
      } else {
        // apenas mostra a categoria; o usuário escolhe os cortes (os
        // recomendados ganham só uma tag, não são marcados automaticamente)
        next.add(cat);
      }
      return next;
    });
  }

  function toggleCorte(id: string) {
    setCortes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
    const payload: EntradaChurrasco = { ...entrada, cortes: [...cortes] };
    router.push(`/resultado?${entradaParaQuery(payload)}`);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <ProgressoEtapas atual={etapa} total={TOTAL_ETAPAS} />

      {etapa === 0 && (
        <EtapaPessoas entrada={entrada} set={set} perfis={PERFIS} />
      )}
      {etapa === 1 && (
        <EtapaCategorias
          selecionadas={categorias}
          onToggle={toggleCategoria}
        />
      )}
      {etapa === 2 && (
        <EtapaCortes
          categorias={categorias}
          selecionados={cortes}
          perfil={entrada.perfil}
          onToggle={toggleCorte}
        />
      )}
      {etapa === 3 && <EtapaExtras entrada={entrada} set={set} />}

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

function ProgressoEtapas({ atual, total }: { atual: number; total: number }) {
  const titulos = ["Pessoas", "Tipos de carne", "Cortes", "Detalhes"];
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

function EtapaPessoas({
  entrada,
  set,
  perfis,
}: {
  entrada: EntradaChurrasco;
  set: <K extends keyof EntradaChurrasco>(
    chave: K,
    valor: EntradaChurrasco[K],
  ) => void;
  perfis: typeof PERFIS;
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
            min={1}
            onChange={(v) => set("adultos", v)}
          />
          <Contador
            label="Crianças"
            valor={entrada.criancas}
            min={0}
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
          min={1}
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
    </div>
  );
}

function EtapaCategorias({
  selecionadas,
  onToggle,
}: {
  selecionadas: Set<Categoria>;
  onToggle: (c: Categoria) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm text-black/60 dark:text-white/60">
        Com quais tipos de carne você quer trabalhar? A quantidade será dividida
        entre os tipos escolhidos.
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIAS.map((cat) => {
          const ativo = selecionadas.has(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggle(cat.id)}
              aria-pressed={ativo}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                ativo
                  ? "border-primary bg-primary-soft"
                  : "bg-surface border-black/10 hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {cat.emoji}
              </span>
              <span className="font-medium">{cat.nome}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function EtapaCortes({
  categorias,
  selecionados,
  perfil,
  onToggle,
}: {
  categorias: Set<Categoria>;
  selecionados: Set<string>;
  perfil: Perfil;
  onToggle: (id: string) => void;
}) {
  const cats = CATEGORIAS.filter((c) => categorias.has(c.id));
  const [aba, setAba] = useState<Categoria | undefined>(cats[0]?.id);
  const abaValida = cats.find((c) => c.id === aba) ? aba : cats[0]?.id;
  const catAtiva = cats.find((c) => c.id === abaValida);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-black/60 dark:text-white/60">
        Escolha os cortes. Os{" "}
        <span className="font-medium text-primary-text">recomendados</span>{" "}
        combinam com o seu churrasco — mas você pode escolher o que quiser.
      </p>
      {selecionados.size === 0 && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-lg border border-amber-500/50 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        >
          Selecione ao menos um corte para continuar.
        </p>
      )}

      {/* Guias por tipo de carne */}
      <div role="tablist" aria-label="Tipos de carne" className="flex gap-2 overflow-x-auto pb-1">
        {cats.map((cat) => {
          const sel = cat.id === abaValida;
          const escolhidos = cortesPorCategoria(cat.id).filter((x) =>
            selecionados.has(x.id),
          ).length;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setAba(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                sel
                  ? "border-primary bg-primary text-white"
                  : "border-black/15 hover:border-black/30 dark:border-white/20 dark:hover:border-white/40"
              }`}
            >
              <span aria-hidden>{cat.emoji}</span> {cat.nome}
              {escolhidos > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs font-bold ${
                    sel ? "bg-white/25" : "bg-primary/15 text-primary-text"
                  }`}
                >
                  {escolhidos}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cortes da categoria ativa */}
      {catAtiva && (
        <div className="flex flex-col gap-3">
          {cortesPorCategoria(catAtiva.id).map((corte) => {
            const ativo = selecionados.has(corte.id);
            const recomendado = ehRecomendado(corte, perfil);
            return (
              <label
                key={corte.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition focus-within:ring-2 focus-within:ring-primary ${
                  ativo
                    ? "border-primary bg-primary-soft"
                    : "bg-surface border-black/10 hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={() => onToggle(corte.id)}
                  className="sr-only"
                />
                <CorteImagem
                  emoji={corte.emoji}
                  imagem={corte.imagem}
                  nome={corte.nome}
                  tamanho={40}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{corte.nome}</span>
                  {recomendado ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary-text">
                      Recomendado
                    </span>
                  ) : (
                    ativo && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-500">
                        ⚠ foge do estilo {perfil} — pode não valer a pena
                      </span>
                    )
                  )}
                </span>
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
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EtapaExtras({
  entrada,
  set,
}: {
  entrada: EntradaChurrasco;
  set: <K extends keyof EntradaChurrasco>(
    chave: K,
    valor: EntradaChurrasco[K],
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Duração
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {DURACOES.map((d) => (
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

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Vai ter
        </legend>
        <Toggle
          label="Acompanhamentos"
          ativo={entrada.temAcompanhamento}
          onChange={(v) => set("temAcompanhamento", v)}
        />
        <Toggle
          label="Sobremesa"
          ativo={entrada.temSobremesa}
          onChange={(v) => set("temSobremesa", v)}
        />
        <Toggle
          label="Bebida alcoólica"
          ativo={entrada.bebeAlcool}
          onChange={(v) => set("bebeAlcool", v)}
        />
      </fieldset>
    </div>
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

function Toggle({
  label,
  ativo,
  onChange,
}: {
  label: string;
  ativo: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 bg-surface p-3 dark:border-white/15">
      <span className="font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={ativo}
        aria-label={label}
        onClick={() => onChange(!ativo)}
        className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          ativo ? "bg-primary" : "bg-black/20 dark:bg-white/25"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${
            ativo ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
