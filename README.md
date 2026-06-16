![Sonochurras — Calculadora de churrasco](docs/banner.svg)

# Sonochurras

Calculadora de churrasco brasileira: descubra a quantidade certa de carne, acompanhamentos e bebidas por pessoa, com rateio entre amigos e lista pronta para compartilhar no WhatsApp.

**Site:** [sonochurras.pages.dev](https://sonochurras.pages.dev)

---

## Features

- **Formulário em 4 etapas** — pessoas, tipos de carne, cortes e detalhes do evento
- **Motor de cálculo** — gramatura por adulto ajustada pela duração do evento, desconto quando há acompanhamentos, e crianças valendo meio adulto
- **Catálogo de 30+ cortes** em 6 categorias (bovina, suína, aves, embutidos, cordeiro e extras da grelha), com fotos, dicas de preparo e marcas recomendadas
- **Perfis de churrasco** — Simples, Intermediário e Sofisticado; cortes fora do perfil recebem aviso, mas não são bloqueados
- **Lista pessoal** — salve o churrasco como uma lista de compras sua; compartilhável por link **somente para visualização**
- **Dividir com a galera** — promova a lista para uma **sala de rateio colaborativa**: quem tem o link entra com o nome e marca o que vai levar (atualiza em tempo real por polling). Sugerido automaticamente quando há mais de um contribuinte
- **Rateio entre contribuintes** — mostra quanto cada pessoa deve trazer além do total por pessoa
- **Links compartilháveis** — toda a entrada fica na query string; o resultado pode ser reaberto ou ajustado a qualquer momento
- **Compartilhar no WhatsApp** — lista completa formatada com negrito nativo e rateio
- **Meus churrascos** — lista, reabre e remove suas listas (índice local em `localStorage`, dados na nuvem)
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
| Backend | Cloudflare Pages Functions + D1 (SQLite) — salas de rateio |
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
│   └── salas.ts            índice local (localStorage) das listas criadas no dispositivo
│
├── components/         componentes React
│
└── app/                rotas (Next.js App Router)
    ├── page.tsx            /  — landing page
    ├── calcular/           /calcular — formulário em 4 etapas
    ├── resultado/          /resultado — resultado calculado + salvar lista
    ├── sala/               /sala — lista pessoal (leitura) ou sala de rateio
    └── meus-churrascos/    /meus-churrascos — histórico local

functions/api/salas/    Cloudflare Pages Functions (CRUD de salas, participantes, compromissos, dividir)
migrations/             schema do D1 (sonochurras-salas)
```

### Ciclo de vida de uma lista

1. **Salvar lista** (no resultado) → cria uma **lista pessoal** no servidor (D1), com código e `hostToken`. Expira em 7 dias.
2. A lista pessoal é **somente leitura** para quem abre o link; só o dono edita (reabrindo a calculadora).
3. **Dividir com a galera** → promove a lista para **sala de rateio colaborativa** (`colaborativa = 1`): participantes entram com nome e assumem itens.

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
- **Quantidades sempre "cheias"**: bovina e suína em peça arredondam para o kg cheio acima; demais carnes (aves, cordeiro, embutidos a peso) arredondam para múltiplos de 200 g abaixo de 1 kg e de 0,5 kg acima — nunca valores quebrados como 820 g ou 1,24 kg
- **Extras da grelha em pacote**: pão de alho e queijo coalho são calculados em pacotes de mercado (≈5 unidades por pacote), não em unidades soltas
- **Acompanhamentos** entram só como "incluídos" (selecionar ou não), sem gramatura — no rateio é apenas "quem leva"
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

As salas de rateio usam um banco **D1** (`sonochurras-salas`). Ao mudar o schema, aplique as migrations **antes** do deploy do código que depende delas:

```bash
npm run db:migrate:local   # D1 local (dev)
npm run db:migrate         # D1 remoto (produção)
```

Para gerar a imagem Open Graph localmente:

```bash
node scripts/gerar-og.mjs
```
