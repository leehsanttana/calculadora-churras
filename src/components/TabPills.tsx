"use client";

export interface AbaPill {
  id: string;
  nome: string;
  emoji: string;
  /** Contador opcional (ex.: itens selecionados/presentes). Some quando 0. */
  count?: number;
}

/**
 * Barra de abas em pílula, reutilizada no wizard e no resultado.
 * Ativa: preenchimento sólido (primary) com sombra. Inativa: card sutil
 * (surface + borda), igual aos cards de item.
 */
export default function TabPills({
  abas,
  ativa,
  onChange,
  ariaLabel = "Categorias",
}: {
  abas: AbaPill[];
  ativa: string | undefined;
  onChange: (id: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex gap-2 overflow-x-auto pb-1">
      {abas.map((a) => {
        const sel = a.id === ativa;
        return (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={sel}
            onClick={() => onChange(a.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              sel
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-black/10 bg-surface hover:border-black/25 dark:border-white/15 dark:hover:border-white/30"
            }`}
          >
            <span aria-hidden>{a.emoji}</span> {a.nome}
            {a.count != null && a.count > 0 && (
              <span
                className={`rounded-full px-1.5 text-xs font-bold ${
                  sel ? "bg-white/25" : "bg-primary/15 text-primary-text"
                }`}
              >
                {a.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
