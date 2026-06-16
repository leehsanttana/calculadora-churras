import type { Categoria, Corte, Perfil } from "@/core/tipos";

/**
 * Catálogo de cortes. Cada corte pertence a uma CATEGORIA (bovina, suína...) e
 * lista os perfis em que é recomendado. Na calculadora o total de carne é
 * dividido entre as categorias escolhidas e, dentro de cada uma, entre os
 * cortes selecionados. Cortes fora do perfil não são bloqueados — apenas
 * sinalizados como "fora do estilo".
 *
 * ⚠️ CONTEÚDO PARA REVISÃO — as recomendações são um ponto de partida.
 */

/** Metadados das categorias (rótulo e ícone para a UI). */
export const CATEGORIAS: { id: Categoria; nome: string; emoji: string }[] = [
  { id: "bovina", nome: "Bovina", emoji: "🐂" },
  { id: "suina", nome: "Suína", emoji: "🐖" },
  { id: "aves", nome: "Aves", emoji: "🍗" },
  { id: "cordeiro", nome: "Cordeiro", emoji: "🐑" },
  { id: "extras", nome: "Extras da grelha", emoji: "🧀" },
];

export const CORTES: Corte[] = [
  // ─────────────────────────── BOVINA ───────────────────────────
  {
    id: "contrafile",
    nome: "Contrafilé",
    categoria: "bovina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🥩",
    dica: "Sal grosso e fogo alto para selar; fatie contra as fibras.",
  },
  {
    id: "alcatra",
    nome: "Alcatra",
    categoria: "bovina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🥩",
    dica: "Versátil e econômica; ótima em peça ou em bifes grossos.",
  },
  {
    id: "fraldinha",
    nome: "Fraldinha",
    categoria: "bovina",
    perfisRecomendados: ["intermediario", "sofisticado"],
    emoji: "🥩",
    dica: "Macia se fatiada contra as fibras; não passe do ponto.",
  },
  {
    id: "maminha",
    nome: "Maminha",
    categoria: "bovina",
    perfisRecomendados: ["intermediario"],
    emoji: "🥩",
    dica: "Suculenta; ótima assada em peça e fatiada fina.",
  },
  {
    id: "picanha",
    nome: "Picanha",
    categoria: "bovina",
    perfisRecomendados: ["intermediario", "sofisticado"],
    emoji: "🥩",
    dica: "Não tire a gordura; fatie sempre contra as fibras.",
  },
  {
    id: "picanha-maturada",
    nome: "Picanha maturada",
    categoria: "bovina",
    perfisRecomendados: ["sofisticado"],
    emoji: "🥩",
    dica: "Maturação intensifica sabor e maciez; ponto mal a médio.",
  },
  {
    id: "bife-ancho",
    nome: "Bife ancho",
    categoria: "bovina",
    perfisRecomendados: ["sofisticado"],
    emoji: "🥩",
    dica: "Marmoreio é o trunfo; selar bem e descansar antes de fatiar.",
  },
  {
    id: "chorizo",
    nome: "Bife de chorizo",
    categoria: "bovina",
    perfisRecomendados: ["sofisticado"],
    emoji: "🥩",
    dica: "Corte argentino do contrafilé; fogo alto e ponto mal a médio.",
  },
  {
    id: "entranha",
    nome: "Entranha",
    categoria: "bovina",
    perfisRecomendados: ["sofisticado"],
    emoji: "🥩",
    dica: "Fina e saborosa; fogo alto e rápido, não passe do ponto.",
  },
  {
    id: "costela-bovina",
    nome: "Costela bovina",
    categoria: "bovina",
    perfisRecomendados: ["intermediario"],
    emoji: "🍖",
    dica: "Pede tempo: assado lento de 4–6h em fogo baixo fica macia.",
  },
  {
    id: "short-rib",
    nome: "Costela premium (short rib)",
    categoria: "bovina",
    perfisRecomendados: ["sofisticado"],
    emoji: "🍖",
    dica: "Curta e carnuda; ótima na brasa direta em pedaços altos.",
  },
  {
    id: "peito-bovino",
    nome: "Peito bovino (brisket)",
    categoria: "bovina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🍖",
    dica: "Econômico; brilha no assado lento e defumado por várias horas.",
  },
  {
    id: "cupim",
    nome: "Cupim",
    categoria: "bovina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🍖",
    dica: "Gordura entremeada pede assado lento; desmancha quando bem feito.",
  },

  // ─────────────────────────── SUÍNA ───────────────────────────
  {
    id: "costela-suina",
    nome: "Costela suína",
    categoria: "suina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🍖",
    dica: "Assa mais rápido que a bovina; combina com barbecue.",
  },
  {
    id: "picanha-suina",
    nome: "Picanha suína",
    categoria: "suina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🥩",
    dica: "Barata e suculenta; mantenha a capa de gordura.",
  },
  {
    id: "copa-lombo",
    nome: "Copa-lombo",
    categoria: "suina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🥩",
    dica: "Suculento; ótimo em bifes grossos ou peça temperada.",
  },
  {
    id: "carre-suino",
    nome: "Carré suíno",
    categoria: "suina",
    perfisRecomendados: ["intermediario", "sofisticado"],
    emoji: "🍖",
    dica: "Bifes com osso; não passe do ponto para não ressecar.",
  },
  {
    id: "pernil",
    nome: "Pernil",
    categoria: "suina",
    perfisRecomendados: ["simples"],
    emoji: "🍖",
    dica: "Econômico para grupos grandes; marinada e assado lento.",
  },

  // ─────────────────────────── AVES ───────────────────────────
  {
    id: "coxa-sobrecoxa",
    nome: "Coxa e sobrecoxa",
    categoria: "aves",
    perfisRecomendados: ["simples"],
    emoji: "🍗",
    dica: "Tempere antes; asse com a pele para baixo primeiro.",
  },
  {
    id: "asa-frango",
    nome: "Asinha de frango",
    categoria: "aves",
    perfisRecomendados: ["simples"],
    emoji: "🍗",
    dica: "Ótima entrada enquanto a carne principal não fica pronta.",
  },
  {
    id: "coracao-frango",
    nome: "Coração de frango",
    categoria: "aves",
    perfisRecomendados: ["intermediario"],
    emoji: "🍢",
    dica: "Aperitivo clássico; sal e fogo alto, mexendo sempre.",
  },

  // ───────────────────────── EMBUTIDOS ─────────────────────────
  {
    id: "linguica-toscana",
    nome: "Linguiça toscana",
    categoria: "suina",
    perfisRecomendados: ["simples", "intermediario"],
    emoji: "🌭",
    // Vendida a peso (rolo/kg), não em peça: mantém granularidade fina.
    fracionado: true,
    dica: "Asse inteira em fogo médio; fure só no final para não secar.",
  },
  {
    id: "linguica-frango",
    nome: "Linguiça de frango",
    categoria: "aves",
    perfisRecomendados: ["simples"],
    emoji: "🌭",
    dica: "Opção mais leve; cuidado que assa mais rápido.",
  },

  // ───────────────────────── CORDEIRO ─────────────────────────
  {
    id: "carre-cordeiro",
    nome: "Carré de cordeiro",
    categoria: "cordeiro",
    perfisRecomendados: ["sofisticado"],
    emoji: "🐑",
    dica: "Ponto mal passado realça o sabor; ervas combinam bem.",
  },

  // ─────────────────────── EXTRAS DA GRELHA ──────────────────────
  // Não entram no rateio de carne: calculados por pessoa, em unidades.
  {
    id: "pao-de-alho",
    nome: "Pão de alho",
    categoria: "extras",
    perfisRecomendados: ["simples", "intermediario", "sofisticado"],
    porPessoa: 1.5,
    // Vendido em pacote (geralmente 5 unidades) — o resultado vem em pacotes.
    unidadesPorPacote: 5,
    emoji: "🥖",
    dica: "Asse nas bordas da grelha, fora do fogo direto.",
  },
  {
    id: "queijo-coalho",
    nome: "Queijo coalho",
    categoria: "extras",
    perfisRecomendados: ["simples", "intermediario", "sofisticado"],
    porPessoa: 1,
    // Também vendido em pacote (espetos) — o resultado vem em pacotes.
    unidadesPorPacote: 5,
    emoji: "🧀",
    dica: "Doure rápido na brasa; sirva ainda quente.",
  },
];

// IDs que possuem foto real em /public/cortes. Os demais usam o emoji.
const COM_IMAGEM = new Set([
  "contrafile",
  "fraldinha",
  "maminha",
  "picanha",
  "picanha-maturada",
  "bife-ancho",
  "chorizo",
  "entranha",
  "costela-bovina",
  "short-rib",
  "costela-suina",
  "coxa-sobrecoxa",
  "asa-frango",
  "coracao-frango",
  "linguica-toscana",
  "linguica-frango",
  "carre-cordeiro",
  // novos cortes econômicos
  "alcatra",
  "peito-bovino",
  "cupim",
  "picanha-suina",
  "copa-lombo",
  "pernil",
  "carre-suino",
]);

for (const corte of CORTES) {
  if (COM_IMAGEM.has(corte.id)) {
    corte.imagem ??= `/cortes/${corte.id}.webp`;
  }
}

/** Busca um corte pelo id. */
export function buscarCorte(id: string): Corte | undefined {
  return CORTES.find((c) => c.id === id);
}

/** Cortes de uma categoria. */
export function cortesPorCategoria(categoria: Categoria): Corte[] {
  return CORTES.filter((c) => c.categoria === categoria);
}

/** Cortes recomendados para um perfil. */
export function cortesRecomendados(perfil: Perfil): Corte[] {
  return CORTES.filter((c) => c.perfisRecomendados.includes(perfil));
}

/** Se um corte é recomendado para o perfil. */
export function ehRecomendado(corte: Corte, perfil: Perfil): boolean {
  return corte.perfisRecomendados.includes(perfil);
}

/** Categorias que possuem ao menos um corte. */
export function categoriasDisponiveis(): typeof CATEGORIAS {
  return CATEGORIAS.filter((cat) =>
    CORTES.some((c) => c.categoria === cat.id),
  );
}
