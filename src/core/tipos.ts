// Tipos centrais do domínio. Sem dependência de React — usado pelo motor de
// cálculo (core/), pela base de conhecimento (data/) e pela persistência (storage/).

/** Nível do churrasco. Define quais cortes são recomendados. */
export type Perfil = "simples" | "intermediario" | "sofisticado";

/** Faixa de duração do evento — afeta a gramatura por pessoa. */
export type Duracao = "curto" | "medio" | "longo"; // <3h | 3-5h | >5h

/**
 * Categoria/tipo de item. O total de carne é dividido entre as categorias de
 * carne escolhidas. "extras" (pão de alho, queijo coalho) é à parte: calculado
 * por pessoa em unidades, fora do rateio de carne.
 */
export type Categoria =
  | "bovina"
  | "suina"
  | "aves"
  | "embutidos"
  | "cordeiro"
  | "extras";

/** Um corte de carne na base de conhecimento. */
export interface Corte {
  id: string;
  nome: string; // "Picanha"
  categoria: Categoria;
  perfisRecomendados: Perfil[]; // perfis em que vale a pena
  emoji?: string; // ilustração padrão quando não há foto
  imagem?: string; // foto real opcional (em /public)
  dica?: string; // dica curta de preparo
  /**
   * Vendido a peso (não em peça de açougue). Bovina/suína normalmente são
   * arredondadas pra cima ao quilo cheio; quem é fracionado (ex.: linguiça)
   * mantém a granularidade fina mesmo sendo suíno.
   */
  fracionado?: boolean;
  /** Só para categoria "extras": unidades por pessoa (ex.: pão de alho 1,5). */
  porPessoa?: number;
}
// (marcas de açougue foram removidas do catálogo)

/** Uma receita de preparo. */
export interface Receita {
  titulo: string;
  tempo?: string; // "40 min"
  ingredientes: string[];
  passos: string[];
}

/** Par de receitas de um item: a do dia a dia e a "para impressionar". */
export interface Receitas {
  padrao: Receita;
  impressionar: Receita;
}

/** Dados informados pelo usuário na calculadora. */
export interface EntradaChurrasco {
  adultos: number;
  criancas: number;
  /** Quantas pessoas vão ratear as compras (para o rateio no resultado). */
  contribuintes: number;
  perfil: Perfil;
  duracao: Duracao;
  /** IDs dos cortes escolhidos. */
  cortes: string[];
  /** IDs dos acompanhamentos escolhidos. */
  acompanhamentos: string[];
  /** IDs das sobremesas escolhidas. */
  sobremesas: string[];
  /** IDs das bebidas escolhidas. */
  bebidas: string[];
}

/** Linha de resultado: um item recomendado com sua quantidade. */
export interface ItemResultado {
  id?: string; // permite buscar a receita do item
  nome: string;
  quantidade: number;
  unidade: "kg" | "g" | "un" | "L";
  categoria?: Categoria;
  dica?: string;
  emoji?: string;
  imagem?: string;
}

/** Saída do motor de cálculo. Nenhum valor em R$ — só quantidades. */
export interface ResultadoChurrasco {
  carnes: ItemResultado[];
  /** Extras da grelha (pão de alho, queijo coalho) — por pessoa, em unidades. */
  extras: ItemResultado[];
  acompanhamentos: ItemResultado[];
  sobremesas: ItemResultado[];
  bebidas: ItemResultado[];
  /** Total ideal de carne (gramatura recomendada, antes de arredondar). */
  totalCarneKg: number;
  /** Total a comprar: soma dos cortes já arredondados (peças em kg cheio). */
  totalCompraKg: number;
}

// ─── Sala de rateio colaborativa ──────────────────────────────────────────────

export interface ParticipanteSala {
  id: string;
  nome: string;
}

export interface CompromissoSala {
  id: string;
  participanteId: string;
  participanteNome: string;
  itemChave: string;   // "{nome}|{unidade}" — identifica o item de forma única
  itemNome: string;
  quantidade: number;
  unidade: string;
}

/** Estado completo da sala retornado pelo GET /api/salas/:code */
export interface EstadoSala {
  code: string;
  nome: string;
  encerrada: boolean;
  resultado: ResultadoChurrasco;
  participantes: ParticipanteSala[];
  compromissos: CompromissoSala[];
}

/** Dados guardados no localStorage pelo dispositivo do participante */
export interface SessaoSala {
  participanteId: string;
  hostToken?: string; // só presente no dispositivo do anfitrião
}
