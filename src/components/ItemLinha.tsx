import type { ItemResultado } from "@/core/tipos";
import CorteImagem from "@/components/CorteImagem";
import ReceitaBotao from "@/components/ReceitaBotao";
import { formatarQuantidade } from "@/core/formato";

/** Uma linha de item do resultado (corte, extra, acompanhamento ou bebida). */
export default function ItemLinha({ item }: { item: ItemResultado }) {
  return (
    <li className="flex gap-3 rounded-xl border border-black/10 bg-surface p-3 dark:border-white/15">
      {(item.emoji || item.imagem) && (
        <CorteImagem
          emoji={item.emoji}
          imagem={item.imagem}
          nome={item.nome}
          tamanho={48}
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-medium">{item.nome}</span>
          <span className="whitespace-nowrap font-semibold tabular-nums text-primary-text">
            {formatarQuantidade(item)}
          </span>
        </div>
        {item.dica && (
          <p className="mt-1 text-xs text-black/55 dark:text-white/55">
            💡 {item.dica}
          </p>
        )}
        <ReceitaBotao id={item.id} nome={item.nome} />
      </div>
    </li>
  );
}
