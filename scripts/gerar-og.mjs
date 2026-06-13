import sharp from "sharp";

// Imagem Open Graph (1200x630) — preview ao compartilhar o link.
const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fff9e6"/>
  <rect x="36" y="36" width="1128" height="558" rx="32" fill="#ffffff" stroke="#08260f" stroke-width="8"/>

  <!-- faixa tricolor -->
  <rect x="44" y="44" width="370" height="22" fill="#009c3b"/>
  <rect x="414" y="44" width="372" height="22" fill="#ffdf00"/>
  <rect x="786" y="44" width="370" height="22" fill="#1351b4"/>

  <!-- selo Copa -->
  <rect x="88" y="112" width="420" height="58" rx="29" fill="#ffdf00" stroke="#08260f" stroke-width="4"/>
  <text x="298" y="150" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#08260f" letter-spacing="1">ESPECIAL COPA DO MUNDO</text>

  <!-- marca -->
  <text x="84" y="306" font-family="Arial, Helvetica, sans-serif" font-size="120" font-weight="800" fill="#08260f" letter-spacing="-2">SONOCHURRAS</text>
  <text x="90" y="372" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="800" fill="#009c3b" letter-spacing="1">CALCULADORA DE CHURRASCO</text>

  <!-- tagline -->
  <text x="90" y="446" font-family="Arial, Helvetica, sans-serif" font-size="33" fill="#08260f">Quanto de carne, bebida e acompanhamento por pessoa.</text>
  <text x="90" y="488" font-family="Arial, Helvetica, sans-serif" font-size="33" fill="#08260f">Sem chute, sem desperdício — e divida a conta com a galera.</text>

  <!-- url -->
  <text x="90" y="556" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#009c3b">sonochurras.pages.dev</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("public/og.png gerado");
