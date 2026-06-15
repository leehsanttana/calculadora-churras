import { describe, expect, it } from "vitest";
import { ENTRADA_PADRAO, entradaParaQuery, parseEntrada } from "@/core/serial";
import type { EntradaChurrasco } from "@/core/tipos";

describe("serial — parse/serialize entrada", () => {
  it("ida e volta preserva a entrada", () => {
    const entrada: EntradaChurrasco = {
      adultos: 12,
      criancas: 3,
      contribuintes: 4,
      perfil: "sofisticado",
      duracao: "longo",
      cortes: ["bife-ancho", "short-rib"],
      acompanhamentos: ["vinagrete", "farofa"],
      sobremesas: ["abacaxi-grelhado"],
      bebidas: ["cerveja", "agua"],
    };
    const query = entradaParaQuery(entrada);
    const params = Object.fromEntries(new URLSearchParams(query));
    expect(parseEntrada(params)).toEqual(entrada);
  });

  it("usa defaults para valores ausentes ou inválidos", () => {
    const r = parseEntrada({
      adultos: "abc",
      perfil: "gourmet", // inválido
      criancas: "-5",
    });
    expect(r.adultos).toBe(ENTRADA_PADRAO.adultos);
    expect(r.perfil).toBe(ENTRADA_PADRAO.perfil);
    expect(r.criancas).toBe(ENTRADA_PADRAO.criancas);
  });

  it("garante ao menos 1 contribuinte", () => {
    expect(parseEntrada({ contrib: "0" }).contribuintes).toBe(1);
    expect(parseEntrada({ contrib: "5" }).contribuintes).toBe(5);
  });

  it("interpreta listas de itens separadas por vírgula", () => {
    const r = parseEntrada({
      cortes: "picanha,fraldinha",
      acomp: "vinagrete,arroz",
      sobremesa: "abacaxi-grelhado",
      bebidas: "cerveja",
    });
    expect(r.cortes).toEqual(["picanha", "fraldinha"]);
    expect(r.acompanhamentos).toEqual(["vinagrete", "arroz"]);
    expect(r.sobremesas).toEqual(["abacaxi-grelhado"]);
    expect(r.bebidas).toEqual(["cerveja"]);
  });

  it("listas ausentes viram arrays vazios", () => {
    const r = parseEntrada({});
    expect(r.cortes).toEqual([]);
    expect(r.acompanhamentos).toEqual([]);
    expect(r.sobremesas).toEqual([]);
    expect(r.bebidas).toEqual([]);
  });
});
