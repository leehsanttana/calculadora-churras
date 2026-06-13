"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Ilustração de um corte. Usa a foto real (`imagem`, em /public) quando
 * existir; se o arquivo faltar ou falhar ao carregar, volta para o emoji
 * estilizado — assim dá para adicionar as fotos aos poucos sem quebrar a UI.
 */
export default function CorteImagem({
  emoji,
  imagem,
  nome,
  tamanho = 48,
}: {
  emoji?: string;
  imagem?: string;
  nome: string;
  tamanho?: number;
}) {
  const [erro, setErro] = useState(false);

  if (imagem && !erro) {
    return (
      <Image
        src={imagem}
        alt={nome}
        width={tamanho}
        height={tamanho}
        onError={() => setErro(true)}
        className="shrink-0 rounded-lg object-cover"
        style={{ width: tamanho, height: tamanho }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary-soft to-accent/15"
      style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.55 }}
    >
      {emoji ?? "🍖"}
    </span>
  );
}
