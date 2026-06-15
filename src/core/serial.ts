import type { Duracao, EntradaChurrasco, Perfil } from "@/core/tipos";

// Serialização da entrada do churrasco de/para query string. Mantém os
// resultados compartilháveis por link e é função pura (testável).

const PERFIS: Perfil[] = ["simples", "intermediario", "sofisticado"];
const DURACOES: Duracao[] = ["curto", "medio", "longo"];

/** Valores padrão usados quando algo está ausente ou inválido. */
export const ENTRADA_PADRAO: EntradaChurrasco = {
  adultos: 10,
  criancas: 0,
  contribuintes: 1,
  perfil: "intermediario",
  duracao: "medio",
  cortes: [],
  acompanhamentos: [],
  sobremesas: [],
  bebidas: [],
};

function inteiroNaoNegativo(valor: unknown, padrao: number): number {
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : padrao;
}

function umDe<T extends string>(valor: unknown, opcoes: T[], padrao: T): T {
  return opcoes.includes(valor as T) ? (valor as T) : padrao;
}

/** Converte os params da URL em uma entrada válida (com defaults). */
export function parseEntrada(
  params: Record<string, string | string[] | undefined>,
): EntradaChurrasco {
  const get = (k: string) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const lista = (k: string) => (get(k) ?? "").split(",").filter(Boolean);

  return {
    adultos: inteiroNaoNegativo(get("adultos"), ENTRADA_PADRAO.adultos),
    criancas: inteiroNaoNegativo(get("criancas"), ENTRADA_PADRAO.criancas),
    contribuintes: Math.max(
      1,
      inteiroNaoNegativo(get("contrib"), ENTRADA_PADRAO.contribuintes),
    ),
    perfil: umDe(get("perfil"), PERFIS, ENTRADA_PADRAO.perfil),
    duracao: umDe(get("duracao"), DURACOES, ENTRADA_PADRAO.duracao),
    cortes: lista("cortes"),
    acompanhamentos: lista("acomp"),
    sobremesas: lista("sobremesa"),
    bebidas: lista("bebidas"),
  };
}

/** Converte a entrada em querystring (sem o `?`). */
export function entradaParaQuery(entrada: EntradaChurrasco): string {
  const params = new URLSearchParams({
    adultos: String(entrada.adultos),
    criancas: String(entrada.criancas),
    contrib: String(entrada.contribuintes),
    perfil: entrada.perfil,
    duracao: entrada.duracao,
  });
  if (entrada.cortes.length > 0) params.set("cortes", entrada.cortes.join(","));
  if (entrada.acompanhamentos.length > 0)
    params.set("acomp", entrada.acompanhamentos.join(","));
  if (entrada.sobremesas.length > 0)
    params.set("sobremesa", entrada.sobremesas.join(","));
  if (entrada.bebidas.length > 0) params.set("bebidas", entrada.bebidas.join(","));
  return params.toString();
}
