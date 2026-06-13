import { describe, expect, it } from "vitest";
import { calcularChurrasco } from "@/core/calculo";
import type { EntradaChurrasco } from "@/core/tipos";

const base: EntradaChurrasco = {
  adultos: 10,
  criancas: 0,
  contribuintes: 1,
  perfil: "intermediario",
  duracao: "medio",
  temAcompanhamento: false,
  temSobremesa: false,
  bebeAlcool: true,
  cortes: [],
};

describe("calcularChurrasco — carnes", () => {
  it("usa a gramatura-base da duração (médio = 450g/adulto)", () => {
    const r = calcularChurrasco(base);
    expect(r.totalCarneKg).toBeCloseTo(4.5, 1); // 10 × 450g
  });

  it("conta criança como meio adulto na carne", () => {
    const r = calcularChurrasco({
      ...base,
      adultos: 4,
      criancas: 2,
      perfil: "simples",
      duracao: "curto", // 300g
    });
    // (4 + 2×0,5) × 300g = 1500g
    expect(r.totalCarneKg).toBeCloseTo(1.5, 1);
  });

  it("desconta 100g/adulto quando há acompanhamento", () => {
    const semAcomp = calcularChurrasco(base);
    const comAcomp = calcularChurrasco({ ...base, temAcompanhamento: true });
    // 450 → 350 por adulto ⇒ -1kg para 10 adultos
    expect(semAcomp.totalCarneKg - comAcomp.totalCarneKg).toBeCloseTo(1, 1);
  });

  it("a soma dos cortes bate com o total a comprar", () => {
    const r = calcularChurrasco({
      ...base,
      cortes: ["picanha", "linguica-toscana"],
    });
    const soma = r.carnes.reduce((s, c) => s + c.quantidade, 0);
    expect(soma).toBeCloseTo(r.totalCompraKg, 2);
  });

  it("arredonda bovina e suína pra cima ao quilo cheio", () => {
    const r = calcularChurrasco({
      ...base,
      adultos: 5, // reduz a gramatura para gerar valores quebrados
      cortes: ["picanha", "contrafile", "picanha-suina"],
    });
    for (const carne of r.carnes) {
      expect(Number.isInteger(carne.quantidade)).toBe(true);
      expect(carne.quantidade).toBeGreaterThanOrEqual(1);
    }
    // total a comprar fica >= ideal (arredondou pra cima)
    expect(r.totalCompraKg).toBeGreaterThanOrEqual(r.totalCarneKg);
  });

  it("sem cortes selecionados, não há carnes (seleção é obrigatória)", () => {
    const r = calcularChurrasco(base); // base.cortes === []
    expect(r.carnes).toHaveLength(0);
    expect(r.totalCompraKg).toBe(0);
  });

  it("extras da grelha são por pessoa (un) e fora do rateio de carne", () => {
    const r = calcularChurrasco({
      ...base,
      adultos: 10,
      criancas: 0,
      cortes: ["pao-de-alho", "picanha"],
    });
    const pao = r.extras.find((e) => e.id === "pao-de-alho");
    expect(pao?.quantidade).toBe(15); // ceil(1,5 × 10)
    expect(pao?.unidade).toBe("un");
    // não contamina as carnes nem o rateio
    expect(r.carnes.some((c) => c.id === "pao-de-alho")).toBe(false);
    expect(r.carnes).toHaveLength(1); // só a picanha
  });

  it("troca o corte conforme a escolha do usuário, sem mudar o total", () => {
    const padrao = calcularChurrasco(base);
    const trocado = calcularChurrasco({ ...base, cortes: ["maminha"] });
    const nomes = trocado.carnes.map((c) => c.nome);
    expect(nomes).toContain("Maminha");
    expect(nomes).not.toContain("Picanha");
    // a escolha não altera a gramatura total
    expect(trocado.totalCarneKg).toBeCloseTo(padrao.totalCarneKg, 2);
  });

  it("divide o total entre categorias e, dentro delas, entre os cortes", () => {
    // Usa aves (sem arredondamento) para checar a divisão exata.
    // 1 categoria (aves), 2 cortes → metade para cada
    const umaCategoria = calcularChurrasco({
      ...base,
      cortes: ["coxa-sobrecoxa", "asa-frango"],
    });
    expect(umaCategoria.carnes).toHaveLength(2);
    expect(umaCategoria.carnes[0].quantidade).toBeCloseTo(
      umaCategoria.totalCarneKg / 2,
      2,
    );

    // 2 categorias (aves + embutidos), 1 corte cada → mesma quantidade
    const duasCategorias = calcularChurrasco({
      ...base,
      cortes: ["coxa-sobrecoxa", "linguica-toscana"],
    });
    const aves = duasCategorias.carnes.find((c) => c.id === "coxa-sobrecoxa");
    const linguica = duasCategorias.carnes.find(
      (c) => c.id === "linguica-toscana",
    );
    expect(aves?.quantidade).toBeCloseTo(linguica?.quantidade ?? -1, 2);
  });

  it("respeita o piso mínimo de gramatura por adulto", () => {
    const r = calcularChurrasco({
      ...base,
      adultos: 1,
      duracao: "curto", // 300 - 100 = 200, acima do piso de 150
      temAcompanhamento: true,
    });
    expect(r.totalCarneKg).toBeCloseTo(0.2, 2);
  });
});

describe("calcularChurrasco — bebidas", () => {
  it("não inclui cerveja quando o grupo não bebe álcool", () => {
    const r = calcularChurrasco({ ...base, bebeAlcool: false });
    expect(r.bebidas.some((b) => /cerveja/i.test(b.nome))).toBe(false);
  });

  it("inclui cerveja quando o grupo bebe álcool", () => {
    const r = calcularChurrasco(base);
    expect(r.bebidas.some((b) => /cerveja/i.test(b.nome))).toBe(true);
  });
});

describe("calcularChurrasco — acompanhamentos", () => {
  it("só inclui sobremesa quando solicitada", () => {
    const sem = calcularChurrasco(base);
    expect(sem.acompanhamentos.length).toBe(0);

    const com = calcularChurrasco({ ...base, temSobremesa: true });
    expect(com.acompanhamentos.some((a) => /abacaxi/i.test(a.nome))).toBe(true);
  });
});
