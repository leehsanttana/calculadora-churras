import type { ItemResultado, ResultadoChurrasco } from "@/core/tipos";
import { formatarPesoKg } from "@/core/formato";
import ItemLinha from "@/components/ItemLinha";
import CarnesTabs from "@/components/CarnesTabs";

function Secao({
  titulo,
  emoji,
  itens,
  vazio,
}: {
  titulo: string;
  emoji: string;
  itens: ItemResultado[];
  vazio?: string;
}) {
  if (itens.length === 0) {
    if (!vazio) return null;
    return (
      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-heading text-xl uppercase tracking-wide">
          <span aria-hidden>{emoji}</span> {titulo}
        </h2>
        <p className="text-sm text-black/50 dark:text-white/50">{vazio}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-heading text-xl uppercase tracking-wide">
        <span aria-hidden>{emoji}</span> {titulo}
      </h2>
      <ul className="flex flex-col gap-3">
        {itens.map((item) => (
          <ItemLinha key={item.nome} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default function ResultadoView({
  resultado,
  pessoas,
  contribuintes,
}: {
  resultado: ResultadoChurrasco;
  pessoas: number;
  contribuintes: number;
}) {
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

      <CarnesTabs itens={resultado.carnes} />
      <Secao titulo="Extras da grelha" emoji="🧀" itens={resultado.extras} />
      <Secao
        titulo="Acompanhamentos"
        emoji="🥗"
        itens={resultado.acompanhamentos}
        vazio="Você marcou sem acompanhamentos."
      />
      <Secao titulo="Bebidas" emoji="🥤" itens={resultado.bebidas} />

      <p className="text-center text-xs text-black/40 dark:text-white/40">
        Valores médios de referência em quantidade — ajuste conforme o apetite
        da galera.
      </p>
    </div>
  );
}
