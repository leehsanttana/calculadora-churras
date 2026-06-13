"use client";

import { useEffect, useState } from "react";

type Modo = "light" | "dark" | "system";

const OPCOES: { valor: Modo; rotulo: string; icone: string }[] = [
  { valor: "light", rotulo: "Claro", icone: "☀️" },
  { valor: "dark", rotulo: "Escuro", icone: "🌙" },
  { valor: "system", rotulo: "Sistema", icone: "💻" },
];

function aplicar(modo: Modo) {
  const escuro =
    modo === "dark" ||
    (modo === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", escuro);
}

/** Seletor de modo: claro / escuro / sistema. Padrão claro. */
export default function ModeToggle() {
  const [modo, setModo] = useState<Modo>("light");

  useEffect(() => {
    const salvo = (localStorage.getItem("mode") as Modo) || "light";
    setModo(salvo);
  }, []);

  // Acompanha o sistema enquanto o modo for "system".
  useEffect(() => {
    if (modo !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => aplicar("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [modo]);

  function escolher(novo: Modo) {
    setModo(novo);
    try {
      localStorage.setItem("mode", novo);
    } catch {}
    aplicar(novo);
  }

  return (
    <div
      role="group"
      aria-label="Tema do app"
      className="inline-flex items-center gap-0.5 rounded-full border border-black/15 bg-surface/90 p-0.5 backdrop-blur dark:border-white/20"
    >
      {OPCOES.map((o) => {
        const ativo = modo === o.valor;
        return (
          <button
            key={o.valor}
            type="button"
            onClick={() => escolher(o.valor)}
            aria-pressed={ativo}
            aria-label={o.rotulo}
            title={o.rotulo}
            className={`flex size-7 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              ativo ? "bg-primary text-white" : "text-foreground/55 hover:text-foreground"
            }`}
          >
            <span aria-hidden>{o.icone}</span>
          </button>
        );
      })}
    </div>
  );
}
