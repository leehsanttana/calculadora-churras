# Sonochurras

Calculadora de churrasco brasileira: descubra a quantidade certa de carne, acompanhamentos e bebidas por pessoa, com rateio entre amigos e lista pronta para compartilhar no WhatsApp.

**Site:** [sonochurras.pages.dev](https://sonochurras.pages.dev)

---

## Features

- **Formulário em 4 etapas** — pessoas, tipos de carne, cortes e detalhes do evento
- **Motor de cálculo** — gramatura por adulto ajustada pela duração do evento, desconto quando há acompanhamentos, e crianças valendo meio adulto
- **Catálogo de 30+ cortes** em 6 categorias (bovina, suína, aves, embutidos, cordeiro e extras da grelha), com fotos, dicas de preparo e marcas recomendadas
- **Perfis de churrasco** — Simples, Intermediário e Sofisticado; cortes fora do perfil recebem aviso, mas não são bloqueados
- **Rateio entre contribuintes** — mostra quanto cada pessoa deve trazer além do total por pessoa
- **Links compartilháveis** — toda a entrada fica na query string; o resultado pode ser reaberdo ou ajustado a qualquer momento
- **Compartilhar no WhatsApp** — lista completa formatada com negrito nativo e rateio
- **Meus churrascos** — salva, lista e remove churrascos no `localStorage`
- **Dark mode** — alterna entre claro, escuro e sistema; persiste entre sessões sem flash no carregamento
- **PWA** — instalável no celular via manifest e meta tags Apple
- **SEO/Open Graph** — imagem OG, Twitter Card e metadata completa em pt-BR

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, export estático) |
| UI | React 19 + Tailwind CSS v4 |
| Linguagem | TypeScript 5 |
| Testes | Vitest |
| Deploy | Cloudflare Pages |

---

## Arquitetura

```
src/
├── core/               lógica de domínio — sem React, sem browser API
│   ├── tipos.ts            interfaces centrais (Corte, EntradaChurrasco, ResultadoChurrasco…)
│   ├── calculo.ts          função pura: EntradaChurrasco → ResultadoChurrasco
│   ├── serial.ts           serialização/parse da entrada para query string
│   ├── compartilhar.ts     formata o texto para WhatsApp
│   └── formato.ts          formata pesos e quantidades para exibição
│
├── data/               base de conhecimento estática (compilada no build)
│   ├── cortes.ts           catálogo de cortes com fotos, dicas e marcas
│   ├── acompanhamentos.ts
│   ├── bebidas.ts
│   ├── dicas-fogo.ts
│   └── receitas.ts
│
├── storage/
│   └── churrascos.ts       CRUD no localStorage (tolerante a SSR e dados corrompidos)
│
├── components/         componentes React
│
└── app/                rotas (Next.js App Router)
    ├── page.tsx            /  — landing page
    ├── calcular/           /calcular — formulário em 4 etapas
    ├── resultado/          /resultado — resultado calculado
    └── meus-churrascos/    /meus-churrascos — histórico local
```

O `core/calculo.ts` é uma **função pura e testável**: sem efeitos colaterais, sem dependência de React ou de browser. Toda a lógica de negócio vive nessa camada e pode ser testada sem montar componentes.

---

## Lógica de cálculo

| Duração | Gramatura-base por adulto |
|---|---|
| Curto (< 3h) | 300 g |
| Médio (3–5h) | 450 g |
| Longo (> 5h) | 600 g |

- Acompanhamentos reduzem 100 g por pessoa
- Crianças equivalem a 0,5 adulto apenas na carne
- O total é dividido igualmente entre as categorias escolhidas e, dentro de cada uma, entre os cortes selecionados
- Bovina e suína são arredondadas para o kg cheio acima (compra em peça de açougue); aves e embutidos mantêm granularidade de 0,01 kg
- Bebidas são calculadas por adulto × hora estimada

---

## Desenvolvimento local

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # testes unitários (Vitest)
npm run build      # build estático em /out
```

---

## Deploy

O projeto usa `output: 'export'` do Next.js e é publicado na Cloudflare Pages via `@cloudflare/next-on-pages`. Qualquer push para `master` dispara o deploy automaticamente.

Para gerar a imagem Open Graph localmente:

```bash
node scripts/gerar-og.mjs
```
