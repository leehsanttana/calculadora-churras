"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface EstadoToast {
  mensagem: string;
  /** Muda a cada chamada para reiniciar a animação mesmo com o mesmo texto. */
  id: number;
}

/**
 * Pequeno gerenciador de toast: `mostrar("...")` exibe a mensagem por alguns
 * segundos. Renderize `<Toast estado={estado} />` uma vez no componente.
 */
export function useToast(duracaoMs = 2200) {
  const [estado, setEstado] = useState<EstadoToast | null>(null);
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrar = useCallback(
    (mensagem: string) => {
      idRef.current += 1;
      setEstado({ mensagem, id: idRef.current });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setEstado(null), duracaoMs);
    },
    [duracaoMs],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { estado, mostrar };
}

/** Pílula animada no rodapé, no estilo "sticker" do app. */
export default function Toast({ estado }: { estado: EstadoToast | null }) {
  if (!estado) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div
        key={estado.id}
        className="animate-toast-pop flex items-center gap-2 rounded-full border-2 border-foreground bg-accent px-5 py-2.5 text-sm font-bold text-black shadow-pop"
      >
        {estado.mensagem}
      </div>
    </div>
  );
}
