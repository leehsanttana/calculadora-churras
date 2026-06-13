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
  temAcompanhamento: true,
  temSobremesa: false,
  bebeAlcool: true,
  cortes: [],
};

function inteiroNaoNegativo(valor: unknown, padrao: number): number {
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : padrao;
}

function umDe<T extends string>(valor: unknown, opcoes: T[], padrao: T): T {
  return opcoes.includes(valor as T) ? (valor as T) : padrao;
}

function booleano(valor: unknown, padrao: boolean): boolean {
  if (valor === "1" || valor === "true") return true;
  if (valor === "0" || valor === "false") return false;
  return padrao;
}

/** Converte os params da URL em uma entrada válida (com defaults). */
export function parseEntrada(
  params: Record<string, string | string[] | undefined>,
): EntradaChurrasco {
  const get = (k: string) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };

  return {
    adultos: inteiroNaoNegativo(get("adultos"), ENTRADA_PADRAO.adultos),
    criancas: inteiroNaoNegativo(get("criancas"), ENTRADA_PADRAO.criancas),
    contribuintes: Math.max(
      1,
      inteiroNaoNegativo(get("contrib"), ENTRADA_PADRAO.contribuintes),
    ),
    perfil: umDe(get("perfil"), PERFIS, ENTRADA_PADRAO.perfil),
    duracao: umDe(get("duracao"), DURACOES, ENTRADA_PADRAO.duracao),
    temAcompanhamento: booleano(get("acomp"), ENTRADA_PADRAO.temAcompanhamento),
    temSobremesa: booleano(get("sobremesa"), ENTRADA_PADRAO.temSobremesa),
    bebeAlcool: booleano(get("alcool"), ENTRADA_PADRAO.bebeAlcool),
    cortes: (get("cortes") ?? "").split(",").filter(Boolean),
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
    acomp: entrada.temAcompanhamento ? "1" : "0",
    sobremesa: entrada.temSobremesa ? "1" : "0",
    alcool: entrada.bebeAlcool ? "1" : "0",
  });
  if (entrada.cortes.length > 0) {
    params.set("cortes", entrada.cortes.join(","));
  }
  return params.toString();
}
