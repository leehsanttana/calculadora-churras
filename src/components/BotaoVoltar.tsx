"use client";

import { useRouter } from "next/navigation";

/**
 * Botão "voltar" que retorna à página anterior (histórico do navegador).
 * Quando não há histórico (link aberto direto), cai no `fallback`.
 */
export default function BotaoVoltar({
  fallback = "/",
  children = "← Voltar",
  className = "text-sm text-foreground/60 hover:underline",
}: {
  fallback?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  function voltar() {
    // history.length > 1 indica que há para onde voltar dentro do app/aba.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button type="button" onClick={voltar} className={className}>
      {children}
    </button>
  );
}
