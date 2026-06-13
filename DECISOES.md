# Sonochurras — Decisões do Projeto

> App: **Sonochurras** (calculadora de churrasco). Domínio: sonochurras.pages.dev

> Documento vivo. Registra as decisões tomadas para não perdermos contexto.
> Última atualização: 2026-06-09

## 1. Visão do produto

Um app que ajuda a pessoa a **planejar a quantidade** de itens de um churrasco —
sem dar valores em dinheiro (R$).

- **Foco em quantidade, não em custo.** Custo de carne muda toda semana e
  envelhece mal; gramatura e tipo de corte valem sempre.
- **Diferencial central:** curadoria de **cortes por perfil de churrasco**
  (simples × intermediário × sofisticado) + **recomendação de marcas**.
  Nenhum concorrente faz essa curadoria — é o que nos diferencia de uma
  fórmula que qualquer um copia.

## 2. Análise de mercado

Nicho saturado de "calculadoras", mas quase todas fazem o que decidimos NÃO fazer
(dar R$ e lista genérica):

- Bora Churrasco — https://borachurrasco.app/
- ChurrascoTime (tem app Android) — https://churrascotime.com/calculadora-de-churrasco
- Calcule.net — https://www.calcule.net/alimentacao/calculo-churrasco/
- OmniCalculator — https://www.omnicalculator.com/pt/alimentacao/calculadora-churrasco
- Internacionais: MeatMath, BBQ Party Calculator

**Conclusão:** a ideia faz sentido com o recorte escolhido (sem R$ + curadoria de cortes/marcas).

## 3. Decisões tomadas

| Tema | Decisão |
|------|---------|
| Plataforma | **Web (PWA)** — sem app store, instalável no celular, fácil de compartilhar por link |
| Tipo de uso | **Planejador completo** — calcular + salvar/editar/compartilhar listas |
| Custo em R$ | **Não exibir** — apenas quantidades (kg/unidades) e recomendações |
| Stack | **Next.js + React + TypeScript + Tailwind CSS** |
| Persistência | **localStorage / IndexedDB** (sem backend no MVP) |
| Backend | **Nenhum no MVP** — toda regra e base de cortes no front |
| Hospedagem | Vercel (custo zero) |

## 4. Regras de cálculo (base do mercado)

Parâmetros padrão que o motor de cálculo usa como ponto de partida:

- Base: **~400g de carne por adulto**
- Por duração: **300g** (<3h), **450g** (3–5h), **600g** (>5h)
- Com acompanhamento: **−100g/pessoa**
- Grupo com mais mulheres/crianças: **−100g/pessoa**
- Criança ≈ **metade** de um adulto
- Bebida: separar alcoólica × não-alcoólica
  (~2 latas + ~1L de não-alcoólica por pessoa como ponto de partida)

## 5. Arquitetura

Regra de ouro: **`data/` e `core/` são separados da UI**. Ajustar gramaturas,
cortes e marcas sem mexer em tela; testar a conta isolada.

```
src/
├── app/          # rotas (Next App Router)
├── components/    # UI
├── core/          # ❤️ motor de cálculo (sem React, 100% testável)
├── data/          # base de conhecimento (cortes, bebidas, marcas)
└── storage/       # salvar/carregar churrascos
```

### Fluxo (calculadora em 4 etapas)

1. **Pessoas + tipo de churrasco** (adultos, crianças, contribuintes, perfil)
2. **Tipos de carne** (categorias: bovina, suína, aves, embutidos, cordeiro,
   **extras da grelha**) — o total de carne é dividido **igualmente entre as
   categorias de carne escolhidas**
3. **Cortes** — lista por categoria. Os recomendados do perfil ganham só uma
   **tag** (NÃO são marcados automaticamente — a seleção é do usuário, senão o
   total inflava). Cortes fora do estilo **não são bloqueados**, apenas
   sinalizados ("⚠ foge do estilo"). **Seleção de ao menos um corte é
   obrigatória** (Avançar bloqueado + mensagem).
4. **Duração + extras** (acompanhamento, sobremesa, bebida)

**Médias de consumo** (validadas com fontes brasileiras — Seara, Atacadão):
adulto ~450 g; com acompanhamentos fartos ~300 g; evento longo até 600 g;
criança ~metade. A gramatura do motor (300/450/600 por duração, −100 com
acompanhamento, criança ×0,5) está alinhada.

**Extras da grelha** (pão de alho, queijo coalho): categoria selecionável junto
com as carnes, mas calculada **por pessoa em unidades** — fora do rateio de
carne e sem arredondar para kg.

### Modelo de dados (coração)

```ts
type Perfil = 'simples' | 'intermediario' | 'sofisticado'
type Categoria = 'bovina' | 'suina' | 'aves' | 'embutidos' | 'cordeiro'

interface Corte {
  id: string
  nome: string                 // "Picanha"
  categoria: Categoria
  perfisRecomendados: Perfil[] // perfis em que vale a pena
  emoji?: string               // ilustração padrão (fallback)
  imagem?: string              // foto real opcional (em /public/cortes)
  dica?: string
  marcas?: string[]            // tags de marca
}

interface Receitas {           // por corte E por acompanhamento (em data/receitas.ts)
  padrao: Receita              // simples, do dia a dia
  impressionar: Receita        // versão elaborada
}
```

Motor: `(adultos, crianças, perfil, duração, extras, cortes escolhidos)`
→ divide o total entre as categorias dos cortes e, dentro de cada uma, entre os
cortes → devolve **cortes + acompanhamentos + bebidas**. Nenhum R$.
Quantidades em kg, exibidas em **gramas quando < 1 kg**.

**Arredondamento:** cortes **bovinos e suínos** (comprados em peça/açougue) são
arredondados **pra cima ao quilo cheio**; aves, embutidos e cordeiro mantêm
granularidade fina. O resultado mostra o **total a comprar** (`totalCompraKg`,
soma arredondada) com o **ideal** (`totalCarneKg`, gramatura) como subtítulo. O
rateio (por pessoa / por contribuinte) usa o total a comprar.

**Receitas:** cada corte/acompanhamento tem botão "Modo de preparo" → modal com
2 receitas (padrão e "para impressionar"). Conteúdo em `data/receitas.ts`.

**Dicas de fogo:** ao salvar um churrasco, mostramos dicas de acender a
churrasqueira (`data/dicas-fogo.ts`).

**Imagens:** cada corte tem `emoji` ilustrativo; com foto real em
`/public/cortes/<id>.webp` o `CorteImagem` usa a foto (fallback automático para
o emoji se faltar). Conversão PNG→WebP em `scripts/converter-cortes.mjs`.

## 6. Roadmap

1. ✅ **Scaffold** (Next 16 + Tailwind + PWA) rodando — build e dev OK
2. ✅ `core/` + `data/` com curadoria inicial de cortes pros 3 perfis + motor
   de cálculo testado (Vitest)
3. ✅ Telas: home → calculadora → resultado → salvar/meus churrascos.
   Entrada serializada na URL (resultados compartilháveis por link);
   persistência em localStorage. Smoke test das 4 rotas OK.
4. ✅ Fluxo em 4 etapas; distribuição por categoria; +cortes econômicos
   (alcatra, peito, cupim, carré suíno, picanha suína, copa-lombo, pernil);
   imagens reais (WebP) dos cortes; modal de receitas (padrão + impressionar)
   para cortes e acompanhamentos; dicas de fogo ao salvar. 14 testes, build OK.

5. ✅ Pass de UX mobile (audit Web Interface Guidelines): alvos de toque ≥44px,
   foco visível (focus-visible / focus-within), base mobile global
   (touch-action, fonte Geist corrigida, color-scheme), modal com trava de
   scroll + safe-area + foco inicial, barra de ação fixa no wizard,
   `viewport-fit=cover`, toggle em `transform`, `tabular-nums`.

6. ✅ Estilo **maximalist chaos** com identidade brasileira (skill
   frontend-design): paleta **verde/amarelo/azul** sobre fundo creme
   (`#fff9e6`) com **textura de confete**, tokens semânticos via CSS variables
   (`primary`, `accent`, `secondary`, `foreground`, `surface`), tipografia
   display **Bebas Neue** em uppercase, flourishes (faixa tricolor, emoji
   rotacionado, ⚽ no card de total com borda amarela, sombras "sticker"
   via `shadow-pop`). Cards com borda fina + cantos arredondados.
   - **App light-only.** `dark:` é class-based e nunca dispara (inerte). Sem
     seletor de tema/modo na UI.
   - Paleta **"churrasco"** (vermelho) fica **guardada** em
     `[data-theme="churrasco"]` (inativa) para uso futuro.
   - *Obs.: chegamos a experimentar neo-brutalism + dark mode, mas voltamos
     para o maximalist chaos claro.*
   - **Modo claro/escuro/sistema** via toggle compacto (icon-only) fixo no
     topo; dark = verde-escuro (`#07170e`), com verde do botão escurecido
     (`#0a8a38`) para contraste AA com texto branco.
   - **Tabs por categoria** (bovina, suína, aves…) na seleção de cortes e nas
     carnes do resultado — usuário vê só os itens da guia ativa.
   - **Compartilhar no WhatsApp** ao salvar: texto identado (carnes, extras,
     acompanhamentos, bebidas + rateio) via `core/compartilhar.ts` → `wa.me`.

**Próximas frentes:** revisar curadoria de cortes/marcas/receitas · ícones e
identidade do PWA · compartilhar lista (imagem) · service worker (offline) ·
imagens dos novos cortes econômicos (hoje usam emoji).

## 7. Em aberto (decidir depois)

- Curadoria detalhada dos cortes e marcas por perfil (conteúdo)
- Compartilhamento de lista (link? imagem?)
- Ícones/identidade visual do PWA
