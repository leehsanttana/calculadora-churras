# Prompt sheet — imagens dos cortes (IA)

Geração das ilustrações de cada corte para a calculadora. **Estilo escolhido:
grelhado / no ponto.** O objetivo é consistência: mesmo enquadramento, mesma
luz, mesmo fundo em todos os cortes — isso importa mais que o realismo de cada
um isolado.

## Como usar

1. Gere cada imagem com o **prompt base + o trecho do corte**.
2. Exporte **quadrada (1:1)**, idealmente **1024×1024**, formato **WebP** (ou PNG).
3. Salve em `public/cortes/` com o **nome = id do corte** (ex.: `picanha.webp`).
4. Me avise (ou faça você): basta preencher o campo `imagem` de cada opção em
   `src/data/cortes.ts` com `/cortes/<id>.webp`. O componente `CorteImagem`
   troca o emoji pela foto automaticamente, e volta pro emoji se faltar arquivo.

## Prompt base (cole antes de cada corte)

> Professional food photography of **[CORTE]**, grilled over charcoal to a
> perfect medium point, visible char grill marks, sliced to reveal a juicy pink
> interior, arranged on a dark slate board, top-down 45° angle, warm directional
> lighting, light wisps of smoke, shallow depth of field, neutral dark
> background, square 1:1 composition, ultra appetizing, high detail, photorealistic.

**Negative / evitar:** `text, watermark, logo, brand, people, hands, raw bloody
meat, plastic look, cartoon, low quality, blurry, extra utensils, busy background`

> Dica de consistência: gere a **picanha primeiro**, aprove o visual e use a
> mesma seed/estilo (ou "image as style reference") para os demais.

## Cortes (id → prompt específico)

| id (nome do arquivo)   | Corte                          | `[CORTE]` no prompt base |
|------------------------|--------------------------------|--------------------------|
| `picanha`              | Picanha                        | a whole Brazilian picanha steak with a thick fat cap |
| `picanha-maturada`     | Picanha maturada               | a dry-aged Brazilian picanha steak with a rich fat cap |
| `maminha`              | Maminha                        | a tri-tip (maminha) beef cut, sliced |
| `fraldinha`            | Fraldinha                      | a flank/bavette (fraldinha) beef steak, sliced thin |
| `contrafile`           | Contrafilé                     | a sirloin (contrafilé) steak |
| `bife-ancho`           | Bife ancho                     | a ribeye (bife ancho) steak with marbling |
| `chorizo`              | Bife de chorizo                | an Argentine bife de chorizo strip steak |
| `entranha`             | Entranha                       | a thin Argentine skirt steak (entraña) |
| `costela-bovina`       | Costela bovina                 | slow-cooked beef short ribs on the bone |
| `short-rib`            | Costela premium (short rib)    | premium thick beef short ribs on the bone |
| `costela-suina`        | Costela suína                  | pork ribs glazed with barbecue sauce |
| `coxa-sobrecoxa`       | Coxa e sobrecoxa de frango     | grilled chicken thighs and drumsticks, crispy skin |
| `asa-frango`           | Asinha de frango               | grilled chicken wings, golden crispy |
| `coracao-frango`       | Coração de frango              | grilled chicken hearts on a skewer |
| `linguica-toscana`     | Linguiça toscana               | grilled Brazilian toscana pork sausage links |
| `linguica-frango`      | Linguiça de frango             | grilled chicken sausage links |
| `carre-cordeiro`       | Carré de cordeiro              | a grilled rack of lamb (frenched), pink interior |

### Novos cortes econômicos

| id (nome do arquivo)   | Corte                          | `[CORTE]` no prompt base | status |
|------------------------|--------------------------------|--------------------------|--------|
| `alcatra`              | Alcatra                        | a grilled top sirloin (alcatra) beef cut, sliced | ✅ ok |
| `peito-bovino`         | Peito bovino (brisket)         | sliced smoked beef brisket with a dark bark and pink smoke ring | ✅ ok |
| `cupim`                | Cupim                          | sliced Brazilian cupim (beef hump), tender and marbled | ✅ ok |
| `picanha-suina`        | Picanha suína                  | a grilled pork picanha steak with a fat cap, sliced | ✅ ok |
| `copa-lombo`           | Copa-lombo                     | grilled pork copa-lombo (coppa) steaks, juicy | ✅ ok |
| `pernil`               | Pernil                         | sliced roasted pork leg (pernil) with golden crackling skin | ✅ ok |
| `carre-suino`          | Carré suíno                    | grilled bone-in pork rack chops (carré) | ✅ ok |

**Todas as 24 imagens de corte entregues.** Ids que aparecem em mais de um
perfil (`picanha`, `fraldinha`, `contrafile`) usam a mesma imagem.

> Os extras da grelha (pão de alho, queijo coalho) usam emoji (🥖/🧀); se quiser
> foto, gere `pao-de-alho.png` / `queijo-coalho.png`, converta e inclua os ids
> em `COM_IMAGEM` (`src/data/cortes.ts`).

## Checklist de nomes (public/cortes/)

```
picanha.webp            picanha-maturada.webp   maminha.webp
fraldinha.webp          contrafile.webp         bife-ancho.webp
chorizo.webp            entranha.webp           costela-bovina.webp
short-rib.webp          costela-suina.webp      coxa-sobrecoxa.webp
asa-frango.webp         coracao-frango.webp     linguica-toscana.webp
linguica-frango.webp    carre-cordeiro.webp

# novos cortes econômicos
alcatra.webp            peito-bovino.webp       cupim.webp
carre-suino.webp        picanha-suina.webp      copa-lombo.webp
pernil.webp
```
