import type { ResultadoChurrasco } from "@/core/tipos";
import { formatarPesoKg } from "@/core/formato";
import ResultadoTabs from "@/components/ResultadoTabs";

interface Props {
  resultado: ResultadoChurrasco;
  pessoas: number;
  contribuintes: number;
  // sala de rateio
  nomeSala?: string;
  setNomeSala?: (v: string) => void;
  onCriarSala?: () => void;
  criandoSala?: boolean;
  erroCriacao?: string;
  salaCode?: string | null;
  onCopiarLink?: (code: string) => void;
  // edição de uma sala existente
  editando?: boolean;
  onSalvarEdicao?: () => void;
}

export default function ResultadoView({
  resultado,
  pessoas,
  contribuintes,
  nomeSala,
  setNomeSala,
  onCriarSala,
  criandoSala,
  erroCriacao,
  salaCode,
  onCopiarLink,
  editando,
  onSalvarEdicao,
}: Props) {
  const arredondar2 = (n: number) => Math.round(n * 100) / 100;
  const total = resultado.totalCompraKg;
  const porPessoaKg = pessoas > 0 ? arredondar2(total / pessoas) : 0;
  const porContribuinteKg =
    contribuintes > 0 ? arredondar2(total / contribuintes) : 0;
  const arredondado = resultado.totalCompraKg !== resultado.totalCarneKg;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="relative overflow-hidden rounded-2xl border-4 border-accent bg-primary p-5 text-center text-white shadow-pop">
        <span
          aria-hidden
          className="absolute right-3 top-3 rotate-12 text-2xl"
        >
          ⚽
        </span>
        <p className="text-sm/relaxed uppercase tracking-wide opacity-90">
          Total de carne
        </p>
        <p className="font-heading text-5xl font-extrabold tabular-nums">
          {formatarPesoKg(total)}
        </p>
        {arredondado && (
          <p className="text-xs opacity-75">
            ideal ~{formatarPesoKg(resultado.totalCarneKg)} · arredondado para
            peças de açougue
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/20 pt-3 text-sm">
          <div>
            <p className="text-xl font-semibold tabular-nums">
              {formatarPesoKg(porPessoaKg)}
            </p>
            <p className="opacity-80">por pessoa ({pessoas})</p>
          </div>
          <div>
            <p className="text-xl font-semibold tabular-nums">
              {formatarPesoKg(porContribuinteKg)}
            </p>
            <p className="opacity-80">
              cada um traz ({contribuintes}{" "}
              {contribuintes > 1 ? "contribuintes" : "contribuinte"})
            </p>
          </div>
        </div>
      </div>

      <ResultadoTabs resultado={resultado} />

      {/* Sala de rateio */}
      {onCriarSala && (
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-surface p-5 dark:border-white/15">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>{editando ? "✏️" : "🤝"}</span>
            <div>
              <p className="font-semibold">
                {editando ? "Editar lista" : "Sala de rateio"}
              </p>
              <p className="text-xs text-foreground/55">
                {editando
                  ? "As alterações aparecem para todos na sala."
                  : "Compartilhe com os amigos e veja quem leva o quê."}
              </p>
            </div>
          </div>

          {salaCode ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3">
                <div>
                  <p className="text-xs text-foreground/60">Código da sala</p>
                  <p className="font-mono text-lg font-bold tracking-widest text-primary-text">
                    {salaCode}
                  </p>
                </div>
                <a
                  href={`/sala?code=${salaCode}`}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-pop-sm"
                >
                  Abrir sala
                </a>
              </div>
              <button
                type="button"
                onClick={() => onCopiarLink?.(salaCode)}
                className="rounded-full border border-black/15 py-2.5 text-sm font-medium dark:border-white/20"
              >
                Copiar link da sala
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={nomeSala ?? ""}
                onChange={(e) => setNomeSala?.(e.target.value)}
                placeholder="Nome do churrasco"
                maxLength={50}
                className="rounded-xl border border-black/15 bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-white/20"
              />
              {erroCriacao && (
                <p className="text-xs text-red-600 dark:text-red-400">{erroCriacao}</p>
              )}
              <button
                type="button"
                onClick={editando ? onSalvarEdicao : onCriarSala}
                disabled={criandoSala || !nomeSala?.trim()}
                className="rounded-full border-2 border-foreground bg-primary py-2.5 text-sm font-semibold text-white shadow-pop-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editando
                  ? criandoSala
                    ? "Salvando…"
                    : "Salvar alterações ✏️"
                  : criandoSala
                    ? "Criando sala…"
                    : "Criar sala de rateio 🤝"}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-black/40 dark:text-white/40">
        Valores médios de referência em quantidade — ajuste conforme o apetite
        da galera.
      </p>
    </div>
  );
}
