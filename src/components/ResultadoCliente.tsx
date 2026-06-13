"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { calcularChurrasco } from "@/core/calculo";
import { entradaParaQuery, parseEntrada } from "@/core/serial";
import ResultadoView from "@/components/ResultadoView";
import SalvarChurrasco from "@/components/SalvarChurrasco";

/** Lê a entrada da URL no cliente e renderiza o resultado (export estático). */
export default function ResultadoCliente() {
  const searchParams = useSearchParams();
  const entrada = parseEntrada(Object.fromEntries(searchParams.entries()));
  const resultado = calcularChurrasco(entrada);
  const query = entradaParaQuery(entrada);

  const semCortes =
    resultado.carnes.length === 0 && resultado.extras.length === 0;

  if (semCortes) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <span className="text-5xl" aria-hidden>
          🍖
        </span>
        <p className="text-black/70 dark:text-white/70">
          Nenhum corte selecionado. Monte seu churrasco escolhendo ao menos um
          corte.
        </p>
        <Link
          href={`/calcular?${query}`}
          className="rounded-full border-2 border-foreground bg-primary px-8 py-3 font-semibold text-white shadow-pop"
        >
          Montar churrasco
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <Link
          href={`/calcular?${query}`}
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          ← Ajustar
        </Link>
        <Link
          href="/meus-churrascos"
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          Meus churrascos
        </Link>
      </header>

      <div className="text-center">
        <h1 className="font-heading text-4xl uppercase">Seu churrasco</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          {entrada.adultos} adulto(s)
          {entrada.criancas > 0 && ` + ${entrada.criancas} criança(s)`} ·{" "}
          {entrada.perfil}
        </p>
      </div>

      <ResultadoView
        resultado={resultado}
        pessoas={entrada.adultos + entrada.criancas}
        contribuintes={entrada.contribuintes}
      />

      <SalvarChurrasco entrada={entrada} />
    </main>
  );
}
