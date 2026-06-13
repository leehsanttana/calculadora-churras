import type {
  EntradaChurrasco,
  ItemResultado,
  ResultadoChurrasco,
} from "@/core/tipos";
import { formatarPesoKg, formatarQuantidade } from "@/core/formato";

function secao(titulo: string, itens: ItemResultado[]): string[] {
  if (itens.length === 0) return [];
  const linhas = ["", `*${titulo}*`];
  for (const item of itens) {
    linhas.push(`   • ${item.nome} — ${formatarQuantidade(item)}`);
  }
  return linhas;
}

/**
 * Monta um texto bem formatado do churrasco para compartilhar (WhatsApp).
 * Usa *negrito* do WhatsApp e listas identadas para a galera saber o que levar.
 */
export function textoCompartilhar(
  nome: string,
  entrada: EntradaChurrasco,
  resultado: ResultadoChurrasco,
): string {
  const pessoas =
    `${entrada.adultos} adulto(s)` +
    (entrada.criancas > 0 ? ` + ${entrada.criancas} criança(s)` : "");

  const linhas: string[] = [];
  linhas.push(`🔥 *${nome.trim() || "Nosso churrasco"}*`);
  linhas.push("");
  linhas.push(`👥 ${pessoas}`);
  linhas.push(`🥩 Total: *${formatarPesoKg(resultado.totalCompraKg)}* de carne`);
  if (entrada.contribuintes > 1) {
    const cada = resultado.totalCompraKg / entrada.contribuintes;
    linhas.push(
      `💸 Cada um traz ~${formatarPesoKg(cada)} (${entrada.contribuintes} pessoas no rateio)`,
    );
  }

  linhas.push(...secao("🥩 CARNES", resultado.carnes));
  linhas.push(...secao("🧀 EXTRAS DA GRELHA", resultado.extras));
  linhas.push(...secao("🥗 ACOMPANHAMENTOS", resultado.acompanhamentos));
  linhas.push(...secao("🥤 BEBIDAS", resultado.bebidas));

  linhas.push("");
  linhas.push("_Feito no Sonochurras 🇧🇷 — sonochurras.pages.dev_");
  return linhas.join("\n");
}

/** Link do WhatsApp com o texto já codificado. */
export function linkWhatsapp(texto: string): string {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
