import type { ItemResultado } from "@/core/tipos";

/** Peso em kg, exibido em gramas quando abaixo de 1 kg. */
export function formatarPesoKg(kg: number): string {
  if (kg < 1) {
    const gramas = Math.round((kg * 1000) / 10) * 10;
    return `${gramas.toLocaleString("pt-BR")} g`;
  }
  return `${kg.toLocaleString("pt-BR")} kg`;
}

/** Quantidade de um item de resultado, com a unidade. */
export function formatarQuantidade(item: ItemResultado): string {
  if (item.unidade === "kg") return formatarPesoKg(item.quantidade);
  return `${item.quantidade.toLocaleString("pt-BR")} ${item.unidade}`;
}
