"use client";

import type { ResultadoChurrasco } from "@/core/tipos";
import { formatarPesoKg } from "@/core/formato";
import ResultadoTabs from "@/components/ResultadoTabs";
import Toast, { useToast } from "@/components/Toast";

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
  onDividir?: (code: string) => void;
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
  onDividir,
  editando,
  onSalvarEdicao,
}: Props) {
  const { estado: toast, mostrar: mostrarToast } = useToast();

  function copiarLink(code: string) {
    onCopiarLink?.(code);
    mostrarToast("🔗 Link copiado!");
  }

  const arredondar2 = (n: number) => Math.round(n * 100) / 100;
  const total = resultado.totalCompraKg;
  const porPessoaKg = pessoas > 0 ? arredondar2(total / pessoas) : 0;
  const porContribuinteKg =
    contribuintes > 0 ? arredondar2(total / contribuintes) : 0;
  const arredondado = resultado.totalCompraKg !== resultado.totalCarneKg;
  const multiplosContribuintes = contribuintes > 1;

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

      {/* Salvar lista / dividir com a galera */}
      {onCriarSala && (
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-surface p-5 dark:border-white/15">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              {editando ? "✏️" : salaCode ? "✅" : "📝"}
            </span>
            <div>
              <p className="font-semibold">
                {editando
                  ? "Editar lista"
                  : salaCode
                    ? "Lista salva!"
                    : "Salvar lista"}
              </p>
              <p className="text-xs text-foreground/55">
                {editando
                  ? "As alterações aparecem para todos na sala."
                  : salaCode
                    ? "Compartilhe para visualização ou divida com a galera."
                    : "Guarde a sua lista de compras do churrasco."}
              </p>
            </div>
          </div>

          {salaCode ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3">
                <div>
                  <p className="text-xs text-foreground/60">Código da lista</p>
                  <p className="font-mono text-lg font-bold tracking-widest text-primary-text">
                    {salaCode}
                  </p>
                </div>
                <a
                  href={`/sala?code=${salaCode}`}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold dark:border-white/20"
                >
                  Abrir lista
                </a>
              </div>

              {multiplosContribuintes && (
                <p className="rounded-lg bg-accent/25 px-3 py-2 text-xs font-medium text-foreground/80">
                  🤝 Vocês são {contribuintes} no rateio — divida com a galera para
                  cada um marcar o que vai levar.
                </p>
              )}

              {onDividir && (
                <button
                  type="button"
                  onClick={() => onDividir(salaCode)}
                  className="rounded-full border-2 border-foreground bg-primary py-2.5 text-sm font-semibold text-white shadow-pop-sm transition-colors hover:bg-primary-hover"
                >
                  Dividir com a galera 🤝
                </button>
              )}
              <button
                type="button"
                onClick={() => copiarLink(salaCode)}
                className="rounded-full border border-black/15 py-2.5 text-sm font-medium dark:border-white/20"
              >
                Copiar link (visualização)
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
                    ? "Salvando…"
                    : "Salvar lista 📝"}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-black/40 dark:text-white/40">
        Valores médios de referência em quantidade — ajuste conforme o apetite
        da galera.
      </p>

      <Toast estado={toast} />
    </div>
  );
}
