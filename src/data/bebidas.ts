/**
 * Bebidas sugeridas. Quantidades por pessoa, em litros (ou latas para cerveja).
 *
 * - Não-alcoólicas valem para todos (adultos + crianças).
 * - Alcoólicas valem só para adultos e só quando o grupo bebe.
 */
export interface Bebida {
  id: string;
  nome: string;
  alcoolica: boolean;
  /** Litros por pessoa por hora de evento. */
  litrosPorPessoaHora?: number;
  /** Latas (350ml) por adulto por hora — usado para cerveja. */
  latasPorAdultoHora?: number;
  unidade: "L" | "un";
}

export const BEBIDAS: Bebida[] = [
  {
    id: "cerveja",
    nome: "Cerveja (latas 350ml)",
    alcoolica: true,
    latasPorAdultoHora: 1,
    unidade: "un",
  },
  {
    id: "refrigerante",
    nome: "Refrigerante",
    alcoolica: false,
    litrosPorPessoaHora: 0.2,
    unidade: "L",
  },
  {
    id: "suco",
    nome: "Suco",
    alcoolica: false,
    litrosPorPessoaHora: 0.1,
    unidade: "L",
  },
  {
    id: "agua",
    nome: "Água",
    alcoolica: false,
    litrosPorPessoaHora: 0.2,
    unidade: "L",
  },
];
