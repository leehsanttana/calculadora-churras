/**
 * Acompanhamentos e sobremesas sugeridos.
 *
 * `gramasPorPessoa` ou `unidadesPorPessoa` definem a quantidade por pessoa
 * (adultos + crianças contam igual para acompanhamento).
 */
export interface Acompanhamento {
  id: string;
  nome: string;
  emoji: string;
  /** Quando a porção é por peso. */
  gramasPorPessoa?: number;
  /** Quando a porção é por unidade (ex.: pão de alho). */
  unidadesPorPessoa?: number;
  categoria: "acompanhamento" | "sobremesa";
  dica?: string;
}

// Obs.: pão de alho e queijo coalho saíram daqui — viraram "Extras da grelha"
// (categoria selecionável junto com as carnes). Ver data/cortes.ts.
export const ACOMPANHAMENTOS: Acompanhamento[] = [
  {
    id: "vinagrete",
    nome: "Vinagrete",
    emoji: "🥗",
    gramasPorPessoa: 60,
    categoria: "acompanhamento",
  },
  {
    id: "farofa",
    nome: "Farofa",
    emoji: "🥣",
    gramasPorPessoa: 50,
    categoria: "acompanhamento",
  },
  {
    id: "arroz",
    nome: "Arroz",
    emoji: "🍚",
    gramasPorPessoa: 100,
    categoria: "acompanhamento",
  },
  {
    id: "pao",
    nome: "Pão francês",
    emoji: "🍞",
    unidadesPorPessoa: 1,
    categoria: "acompanhamento",
  },
  {
    id: "maionese",
    nome: "Salada de maionese",
    emoji: "🥔",
    gramasPorPessoa: 80,
    categoria: "acompanhamento",
  },
  {
    id: "abacaxi-grelhado",
    nome: "Abacaxi grelhado com canela",
    emoji: "🍍",
    gramasPorPessoa: 80,
    categoria: "sobremesa",
    dica: "Polvilhe canela e açúcar antes de grelhar.",
  },
];
