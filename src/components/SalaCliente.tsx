"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { EstadoSala, SessaoSala } from "@/core/tipos";
import { entradaParaQuery } from "@/core/serial";
import {
  buscarSala as buscarSalaLocal,
  salvarSala as salvarSalaLocal,
  removerSala as removerSalaLocal,
} from "@/storage/salas";
import SalaView from "@/components/SalaView";

const POLLING_MS = 4000;

function chaveLocalStorage(code: string) {
  return `sala:${code}:sessao`;
}

function lerSessao(code: string): SessaoSala | null {
  try {
    const raw = localStorage.getItem(chaveLocalStorage(code));
    return raw ? (JSON.parse(raw) as SessaoSala) : null;
  } catch {
    return null;
  }
}

function salvarSessao(code: string, sessao: SessaoSala) {
  localStorage.setItem(chaveLocalStorage(code), JSON.stringify(sessao));
}

export default function SalaCliente() {
  const router = useRouter();
  const params = useSearchParams();
  const code = (params.get("code") ?? "").toUpperCase();

  const [sala, setSala] = useState<EstadoSala | null>(null);
  const [sessao, setSessao] = useState<SessaoSala | null>(null);
  const [nome, setNome] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [erroEntrada, setErroEntrada] = useState("");
  const [erroSala, setErroSala] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function buscarSala() {
    if (!code) return;
    try {
      const res = await fetch(`/api/salas/${code}`);
      if (!res.ok) {
        const { erro } = await res.json();
        setErroSala(erro ?? "Sala não encontrada.");
        return;
      }
      const dados: EstadoSala = await res.json();
      setSala(dados);
      setErroSala("");
    } catch {
      setErroSala("Sem conexão com o servidor.");
    }
  }

  // Carrega sessão do localStorage e inicia polling
  useEffect(() => {
    if (!code) return;
    const sessaoSalva = lerSessao(code);
    if (sessaoSalva) setSessao(sessaoSalva);
    buscarSala();
    intervalRef.current = setInterval(buscarSala, POLLING_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setEntrando(true);
    setErroEntrada("");
    try {
      const res = await fetch(`/api/salas/${code}/participantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim() }),
      });
      if (!res.ok) {
        const { erro } = await res.json();
        setErroEntrada(erro ?? "Erro ao entrar na sala.");
        return;
      }
      const { id } = await res.json();
      const novaSessao: SessaoSala = { participanteId: id };
      salvarSessao(code, novaSessao);
      setSessao(novaSessao);
      await buscarSala();
    } catch {
      setErroEntrada("Sem conexão com o servidor.");
    } finally {
      setEntrando(false);
    }
  }

  async function excluirSala() {
    if (!sessao?.hostToken || !sala) return;
    const aviso = sala.colaborativa
      ? "Excluir esta sala? Ela será encerrada para todos."
      : "Excluir esta lista?";
    if (!window.confirm(aviso)) return;
    try {
      await fetch(`/api/salas/${code}`, {
        method: "DELETE",
        headers: { "X-Host-Token": sessao.hostToken },
      });
    } catch {}
    removerSalaLocal(code);
    router.push("/meus-churrascos");
  }

  async function dividir() {
    if (!sessao?.hostToken) return;
    await fetch(`/api/salas/${code}/dividir`, {
      method: "POST",
      headers: { "X-Host-Token": sessao.hostToken },
    });
    const local = buscarSalaLocal(code);
    if (local) salvarSalaLocal({ ...local, colaborativa: true });
    await buscarSala();
  }

  async function removerCompromisso(participanteId: string, itemChave: string) {
    if (!sessao?.hostToken) return;
    await fetch(`/api/salas/${code}/compromissos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Host-Token": sessao.hostToken,
      },
      body: JSON.stringify({ participanteId, itemChave }),
    });
    await buscarSala();
  }

  if (!code) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <span className="text-4xl">🔗</span>
        <p className="text-foreground/60">Link inválido. Peça ao anfitrião o link correto.</p>
        <Link href="/" className="text-sm font-medium text-primary-text hover:underline">
          ← Início
        </Link>
      </main>
    );
  }

  if (erroSala) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <span className="text-4xl">😕</span>
        <p className="font-medium">{erroSala}</p>
        <Link href="/" className="text-sm font-medium text-primary-text hover:underline">
          ← Início
        </Link>
      </main>
    );
  }

  if (!sala) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <span className="animate-pulse text-4xl">🔥</span>
        <p className="text-foreground/60">Carregando sala…</p>
      </main>
    );
  }

  // Quem é dono (tem hostToken salvo neste dispositivo) e link de edição.
  const salaLocal = buscarSalaLocal(code);
  const isHost = !!sessao?.hostToken;
  const linkEditar =
    isHost && salaLocal
      ? `/calcular?${entradaParaQuery(salaLocal.entrada)}&sala=${code}`
      : undefined;

  // Lista pessoal: somente leitura. O anfitrião ganha as ações (editar/dividir).
  if (!sala.colaborativa) {
    return (
      <SalaView
        sala={sala}
        sessao={sessao}
        onAtualizar={buscarSala}
        onDividir={isHost ? dividir : undefined}
        onExcluir={isHost ? excluirSala : undefined}
        sugerirDividir={(salaLocal?.entrada.contribuintes ?? 1) > 1}
        linkEditar={linkEditar}
      />
    );
  }

  // Sala de rateio cheia (atingiu o nº de contribuintes): novos visitantes só
  // conseguem visualizar a lista — não entram no rateio.
  if (!sessao && sala.participantes.length >= sala.maxParticipantes) {
    return <SalaView sala={sala} sessao={null} onAtualizar={buscarSala} />;
  }

  // Sala de rateio com vaga: exige entrar (informar o nome) antes dos controles.
  if (!sessao) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-foreground/60 hover:underline">← Início</Link>
        </header>

        <div className="text-center">
          <span className="text-5xl">🔥</span>
          <h1 className="mt-3 font-heading text-4xl uppercase">{sala.nome}</h1>
          <p className="mt-1 text-sm text-foreground/60">
            {sala.resultado.carnes.length > 0
              ? `${sala.resultado.totalCompraKg}kg de carne · ${sala.participantes.length} confirmado(s)`
              : "Churrasco colaborativo"}
          </p>
        </div>

        <form onSubmit={entrar} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Seu nome
            </span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria"
              autoFocus
              maxLength={40}
              className="rounded-xl border border-black/15 bg-surface px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary dark:border-white/20"
            />
          </label>

          {erroEntrada && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              {erroEntrada}
            </p>
          )}

          <button
            type="submit"
            disabled={entrando || !nome.trim()}
            className="rounded-full border-2 border-foreground bg-primary py-3 font-semibold text-white shadow-pop-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {entrando ? "Entrando…" : "Entrar na sala 🔥"}
          </button>
        </form>

        <p className="text-center text-xs text-foreground/40">
          Você vai ver a lista de compras e informar o que vai levar.
        </p>
      </main>
    );
  }

  return (
    <SalaView
      sala={sala}
      sessao={sessao}
      onExcluir={isHost ? excluirSala : undefined}
      onRemoverCompromisso={isHost ? removerCompromisso : undefined}
      onAtualizar={buscarSala}
      linkEditar={linkEditar}
    />
  );
}
