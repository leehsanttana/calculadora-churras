"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChurrascoSalvo } from "@/core/tipos";
import { entradaParaQuery } from "@/core/serial";
import { listarChurrascos, removerChurrasco } from "@/storage/churrascos";
import DicasFogo from "@/components/DicasFogo";

export default function MeusChurrascosPage() {
  const [lista, setLista] = useState<ChurrascoSalvo[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setLista(listarChurrascos());
    setCarregado(true);
  }, []);

  function remover(id: string) {
    removerChurrasco(id);
    setLista(listarChurrascos());
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          ← Início
        </Link>
        <Link
          href="/calcular"
          className="text-sm font-medium text-primary-text hover:underline"
        >
          + Novo
        </Link>
      </header>

      <h1 className="font-heading text-4xl uppercase">Meus churrascos</h1>

      {!carregado ? null : lista.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/20 p-8 text-center">
          <span className="text-4xl" aria-hidden>
            🗒️
          </span>
          <p className="text-sm text-foreground/60">
            Você ainda não salvou nenhum churrasco.
          </p>
          <Link
            href="/calcular"
            className="rounded-full border-2 border-foreground bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-pop-sm"
          >
            Montar o primeiro
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {lista.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-xl border border-black/10 bg-surface p-4 dark:border-white/15"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/resultado?${entradaParaQuery(c.entrada)}`}
                  className="flex flex-1 flex-col"
                >
                  <span className="font-medium">{c.nome}</span>
                  <span className="text-xs text-black/55 dark:text-white/55">
                    {c.entrada.adultos} adulto(s)
                    {c.entrada.criancas > 0 &&
                      ` + ${c.entrada.criancas} criança(s)`}{" "}
                    · {c.entrada.perfil}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => remover(c.id)}
                  aria-label={`Remover ${c.nome}`}
                  className="rounded-lg px-2 py-1 text-sm text-black/40 transition-colors hover:bg-primary-soft hover:text-primary-text dark:text-white/40"
                >
                  Excluir
                </button>
              </div>

              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <span className="transition group-open:rotate-90">›</span>
                  🔥 Como acender a churrasqueira
                </summary>
                <div className="mt-2">
                  <DicasFogo />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
