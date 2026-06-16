"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SalaSalva } from "@/storage/salas";
import { listarSalas, removerSala } from "@/storage/salas";
import { entradaParaQuery } from "@/core/serial";
import MenuAcoes from "@/components/MenuAcoes";

export default function MeusChurrascosPage() {
  const [lista, setLista] = useState<SalaSalva[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setLista(listarSalas());
    setCarregado(true);
  }, []);

  async function excluir(sala: SalaSalva) {
    const aviso =
      sala.colaborativa === false
        ? `Excluir "${sala.nome}"?`
        : `Excluir "${sala.nome}"? A sala será encerrada para todos.`;
    const ok = window.confirm(aviso);
    if (!ok) return;
    // Encerra no servidor (best-effort) e remove do índice local.
    try {
      await fetch(`/api/salas/${sala.code}`, {
        method: "DELETE",
        headers: { "X-Host-Token": sala.hostToken },
      });
    } catch {}
    removerSala(sala.code);
    setLista(listarSalas());
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <span className="font-heading text-lg uppercase tracking-wide">
          🔥 Sonochurras
        </span>
        <Link
          href="/calcular"
          className="text-sm font-medium text-primary-text hover:underline"
        >
          + Nova lista
        </Link>
      </header>

      <h1 className="font-heading text-4xl uppercase">Minhas listas</h1>

      {!carregado ? null : lista.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/20 p-8 text-center">
          <span className="text-4xl" aria-hidden>
            🗒️
          </span>
          <p className="text-sm text-foreground/60">
            Você ainda não criou nenhuma lista.
          </p>
          <Link
            href="/calcular"
            className="rounded-full border-2 border-foreground bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-pop-sm"
          >
            Montar a primeira
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {lista.map((s) => (
            <li
              key={s.code}
              className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-surface p-4 dark:border-white/15"
            >
              <Link href={`/sala?code=${s.code}`} className="flex flex-1 flex-col gap-1">
                <span className="flex items-center gap-2">
                  <span className="font-medium">{s.nome}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      s.colaborativa === false
                        ? "bg-black/8 text-foreground/60 dark:bg-white/10"
                        : "bg-primary-soft text-primary-text"
                    }`}
                  >
                    {s.colaborativa === false ? "Pessoal" : "Rateio"}
                  </span>
                </span>
                <span className="text-xs text-black/55 dark:text-white/55">
                  {s.entrada.adultos} adulto(s)
                  {s.entrada.criancas > 0 && ` + ${s.entrada.criancas} criança(s)`}
                  {" · "}
                  <span className="font-mono tracking-widest">{s.code}</span>
                </span>
              </Link>
              <MenuAcoes
                rotulo={`Ações de ${s.nome}`}
                acoes={[
                  {
                    label: "Editar",
                    icone: "✏️",
                    href: `/calcular?${entradaParaQuery(s.entrada)}&sala=${s.code}`,
                  },
                  {
                    label: "Excluir",
                    icone: "🗑️",
                    perigo: true,
                    onClick: () => excluir(s),
                  },
                ]}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
