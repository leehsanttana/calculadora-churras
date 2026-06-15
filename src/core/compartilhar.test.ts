import { describe, expect, it } from "vitest";
import { calcularChurrasco } from "@/core/calculo";
import { linkWhatsapp, textoCompartilhar } from "@/core/compartilhar";
import type { EntradaChurrasco } from "@/core/tipos";

const entrada: EntradaChurrasco = {
  adultos: 10,
  criancas: 0,
  contribuintes: 2,
  perfil: "intermediario",
  duracao: "medio",
  cortes: ["picanha", "linguica-toscana"],
  acompanhamentos: [],
  sobremesas: [],
  bebidas: ["cerveja"],
};

describe("textoCompartilhar", () => {
  it("monta o texto com título, total, rateio e os cortes", () => {
    const r = calcularChurrasco(entrada);
    const t = textoCompartilhar("Aniversário do João", entrada, r);
    expect(t).toContain("*Aniversário do João*");
    expect(t).toContain("*🥩 CARNES*");
    expect(t).toContain("Picanha");
    expect(t).toContain("Total:");
    expect(t).toContain("Cada um traz");
  });

  it("usa um nome padrão quando vazio", () => {
    const r = calcularChurrasco(entrada);
    expect(textoCompartilhar("  ", entrada, r)).toContain("Nosso churrasco");
  });
});

describe("linkWhatsapp", () => {
  it("codifica o texto na URL", () => {
    expect(linkWhatsapp("a b")).toBe("https://wa.me/?text=a%20b");
  });
});
