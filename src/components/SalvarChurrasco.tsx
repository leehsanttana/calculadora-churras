"use client";

import { useState } from "react";
import type { EntradaChurrasco } from "@/core/tipos";
import { salvarChurrasco } from "@/storage/churrascos";
import { calcularChurrasco } from "@/core/calculo";
import { linkWhatsapp, textoCompartilhar } from "@/core/compartilhar";
import DicasFogo from "@/components/DicasFogo";

export default function SalvarChurrasco({
  entrada,
}: {
  entrada: EntradaChurrasco;
}) {
  const [salvo, setSalvo] = useState(false);
  const [nome, setNome] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    salvarChurrasco(nome, entrada);
    setSalvo(true);
  }

  if (salvo) {
    const texto = textoCompartilhar(nome, entrada, calcularChurrasco(entrada));
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-xl border border-primary/30 bg-primary-soft p-3 text-center text-sm font-medium text-primary-text">
          ✓ Churrasco salvo! Veja em <strong>Meus churrascos</strong>.
        </p>
        <a
          href={linkWhatsapp(texto)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border-2 border-foreground bg-[#25d366] px-5 py-3 font-semibold text-white shadow-pop-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          💬 Compartilhar lista no WhatsApp
        </a>
        <DicasFogo />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-xl border border-black/10 bg-surface p-3 dark:border-white/15"
    >
      <label htmlFor="nome-churras" className="text-sm font-medium">
        Salvar este churrasco
      </label>
      <div className="flex gap-2">
        <input
          id="nome-churras"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex.: Aniversário do João"
          className="flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary dark:border-white/20"
        />
        <button
          type="submit"
          className="rounded-full border-2 border-foreground bg-primary px-5 py-2 text-sm font-semibold text-white shadow-pop-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
