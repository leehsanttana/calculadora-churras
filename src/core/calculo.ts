import type {
  Corte,
  Duracao,
  EntradaChurrasco,
  ItemResultado,
  ResultadoChurrasco,
} from "@/core/tipos";
import { buscarCorte } from "@/data/cortes";
import { ACOMPANHAMENTOS } from "@/data/acompanhamentos";
import { BEBIDAS } from "@/data/bebidas";

/** Gramatura-base de carne por adulto, conforme a duração do evento. */
const BASE_CARNE_POR_DURACAO: Record<Duracao, number> = {
  curto: 300, // < 3h
  medio: 450, // 3–5h
  longo: 600, // > 5h
};

/** Horas estimadas por faixa de duração — usado para o cálculo de bebidas. */
const HORAS_POR_DURACAO: Record<Duracao, number> = {
  curto: 2.5,
  medio: 4,
  longo: 6,
};

/** Quanto reduzir por pessoa quando há acompanhamentos. */
const DESCONTO_ACOMPANHAMENTO = 100;

/** Piso de gramatura por adulto, para não chegar a valores irreais. */
const MIN_CARNE_POR_ADULTO = 150;

/** Criança consome cerca de metade de um adulto (apenas para carne). */
const FATOR_CRIANCA = 0.5;

function arredondar(valor: number, casas = 1): number {
  const f = 10 ** casas;
  return Math.round(valor * f) / f;
}

/**
 * Arredonda um peso (kg) para valores "cheios", fáceis de comprar:
 * abaixo de 1 kg, múltiplos de 200 g (200 g, 400 g, 800 g…);
 * a partir de 1 kg, múltiplos de 0,5 kg (1 kg, 1,5 kg, 2 kg…).
 * Nunca devolve valores quebrados como 820 g ou 1,24 kg.
 */
function arredondarPesoBonito(kg: number): number {
  if (kg <= 0) return 0;
  const passo = kg < 1 ? 0.2 : 0.5;
  const arredondado = Math.max(passo, Math.round(kg / passo) * passo);
  return Math.round(arredondado * 100) / 100;
}

/**
 * Motor de cálculo do churrasco. Função pura: dada a entrada do usuário,
 * devolve as quantidades recomendadas (carnes, acompanhamentos e bebidas).
 * Nenhum valor em dinheiro — só quantidade.
 */
export function calcularChurrasco(
  entrada: EntradaChurrasco,
): ResultadoChurrasco {
  const { adultos, criancas, duracao } = entrada;

  const pessoasTotal = adultos + criancas;
  const pessoasEquivCarne = adultos + criancas * FATOR_CRIANCA;
  const horas = HORAS_POR_DURACAO[duracao];

  // Itens selecionados pelo usuário (igual aos cortes).
  const acompSelecionados = new Set(entrada.acompanhamentos);
  const sobremesasSelecionadas = new Set(entrada.sobremesas);
  const bebidasSelecionadas = new Set(entrada.bebidas);
  const temAcompanhamento = entrada.acompanhamentos.length > 0;

  // ── Carnes ────────────────────────────────────────────────────────
  const gramasAlvoAdulto = Math.max(
    MIN_CARNE_POR_ADULTO,
    BASE_CARNE_POR_DURACAO[duracao] -
      (temAcompanhamento ? DESCONTO_ACOMPANHAMENTO : 0),
  );
  const totalCarneGramas = pessoasEquivCarne * gramasAlvoAdulto;

  // Itens escolhidos. Sem fallback: nada selecionado = nada de carne (a
  // seleção de ao menos um corte é obrigatória no formulário).
  const selecionados: Corte[] = entrada.cortes
    .map(buscarCorte)
    .filter((c): c is Corte => Boolean(c));

  // Carnes (entram no rateio) vs extras da grelha (pão/queijo, por pessoa).
  const cortesCarne = selecionados.filter((c) => c.categoria !== "extras");
  const cortesExtra = selecionados.filter((c) => c.categoria === "extras");

  // O total é dividido entre as categorias de carne e, dentro de cada uma,
  // entre os cortes selecionados daquela categoria.
  const categorias = [...new Set(cortesCarne.map((c) => c.categoria))];
  const numCategorias = categorias.length;

  const carnes: ItemResultado[] = cortesCarne.map((corte) => {
    const naCategoria = cortesCarne.filter(
      (c) => c.categoria === corte.categoria,
    ).length;
    const kgBruto =
      numCategorias > 0 && naCategoria > 0
        ? totalCarneGramas / numCategorias / naCategoria / 1000
        : 0;
    // Bovina e suína são compradas em peça/no açougue: arredonda pra cima ao
    // quilo cheio. Itens vendidos a peso (fracionado, ex.: linguiça), aves e
    // cordeiro mantêm granularidade fina.
    const emPeca =
      (corte.categoria === "bovina" || corte.categoria === "suina") &&
      !corte.fracionado;
    const quantidade =
      kgBruto <= 0
        ? 0
        : emPeca
          ? Math.ceil(kgBruto - 1e-9)
          : arredondarPesoBonito(kgBruto);
    return {
      id: corte.id,
      nome: corte.nome,
      quantidade,
      unidade: "kg",
      categoria: corte.categoria,
      dica: corte.dica,
      emoji: corte.emoji,
      imagem: corte.imagem,
    };
  });

  const totalCarneKg = arredondar(totalCarneGramas / 1000, 2);
  const totalCompraKg = arredondar(
    carnes.reduce((s, c) => s + c.quantidade, 0),
    2,
  );

  // ── Extras da grelha (pão de alho, queijo coalho) ─────────────────
  // Pão de alho e queijo coalho são comprados em PACOTE (não unidade solta):
  // calcula as unidades por pessoa e converte em pacotes cheios.
  const extras: ItemResultado[] = cortesExtra.map((corte) => {
    const unidades = Math.ceil((corte.porPessoa ?? 0) * pessoasTotal);
    const porPacote = corte.unidadesPorPacote ?? 0;
    const emPacote = porPacote > 0;
    return {
      id: corte.id,
      nome: corte.nome,
      quantidade: emPacote ? Math.ceil(unidades / porPacote) : unidades,
      unidade: emPacote ? "pacote" : "un",
      categoria: corte.categoria,
      dica: corte.dica,
      emoji: corte.emoji,
      imagem: corte.imagem,
    };
  });

  // ── Acompanhamentos e sobremesas (só os selecionados) ─────────────
  const acompanhamentos: ItemResultado[] = [];
  const sobremesas: ItemResultado[] = [];
  if (pessoasTotal > 0) {
    for (const item of ACOMPANHAMENTOS) {
      const ehSobremesa = item.categoria === "sobremesa";
      const selecionado = ehSobremesa
        ? sobremesasSelecionadas.has(item.id)
        : acompSelecionados.has(item.id);
      if (!selecionado) continue;

      // Acompanhamentos são apenas marcados como "incluídos" — sem gramatura.
      // Quem decide servir, serve à vontade; no rateio é só "quem leva".
      if (!ehSobremesa) {
        acompanhamentos.push({
          id: item.id,
          nome: item.nome,
          quantidade: 1,
          unidade: "un",
          semQuantidade: true,
          dica: item.dica,
          emoji: item.emoji,
        });
        continue;
      }

      // Sobremesas mantêm a quantidade, mas em valores cheios.
      const linha: ItemResultado =
        item.unidadesPorPessoa != null
          ? {
              id: item.id,
              nome: item.nome,
              quantidade: Math.ceil(item.unidadesPorPessoa * pessoasTotal),
              unidade: "un",
              dica: item.dica,
              emoji: item.emoji,
            }
          : {
              id: item.id,
              nome: item.nome,
              quantidade: arredondarPesoBonito(
                ((item.gramasPorPessoa ?? 0) * pessoasTotal) / 1000,
              ),
              unidade: "kg",
              dica: item.dica,
              emoji: item.emoji,
            };

      sobremesas.push(linha);
    }
  }

  // ── Bebidas (só as selecionadas) ──────────────────────────────────
  // Alcoólicas contam só adultos; não-alcoólicas contam todos.
  const bebidas: ItemResultado[] = [];
  for (const bebida of BEBIDAS) {
    if (!bebidasSelecionadas.has(bebida.id)) continue;

    if (bebida.latasPorAdultoHora != null) {
      const latas = Math.ceil(bebida.latasPorAdultoHora * adultos * horas);
      if (latas > 0) {
        bebidas.push({
          id: bebida.id,
          nome: bebida.nome,
          quantidade: latas,
          unidade: "un",
          emoji: bebida.emoji,
        });
      }
    } else if (bebida.litrosPorPessoaHora != null) {
      const consumidores = bebida.alcoolica ? adultos : pessoasTotal;
      const litros = arredondar(
        bebida.litrosPorPessoaHora * consumidores * horas,
        1,
      );
      if (litros > 0) {
        bebidas.push({
          id: bebida.id,
          nome: bebida.nome,
          quantidade: litros,
          unidade: "L",
          emoji: bebida.emoji,
        });
      }
    }
  }

  return {
    carnes,
    extras,
    acompanhamentos,
    sobremesas,
    bebidas,
    totalCarneKg,
    totalCompraKg,
  };
}
