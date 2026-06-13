import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const SAIDA = path.resolve("public/cortes");

// Nome do arquivo de origem (sem acento, minúsculo, sem extensão) → id do corte.
const MAPA = {
  picanha: "picanha",
  maminha: "maminha",
  fraldinha: "fraldinha",
  "contra-file": "contrafile",
  ancho: "bife-ancho",
  chorizo: "chorizo",
  entranha: "entranha",
  costela: "costela-bovina",
  "costela-prime": "short-rib",
  "costela-suina": "costela-suina",
  "coxa-e-sobrecoxa": "coxa-sobrecoxa",
  "asinhas-de-grango": "asa-frango",
  "coracao-de-frango": "coracao-frango",
  "linguica-toscana": "linguica-toscana",
  "linguica-frango": "linguica-frango",
  "carre-cordeiro": "carre-cordeiro",
  // novos cortes econômicos
  alcatra: "alcatra",
  "peito-bovino": "peito-bovino",
  cupim: "cupim",
  "picanha-suina": "picanha-suina",
  "copa-lombo": "copa-lombo",
  "pernil-suino": "pernil",
  "carre-suino": "carre-suino",
};

// Cortes que reaproveitam a imagem de outro (id origem → ids extras).
const REAPROVEITAR = { picanha: ["picanha-maturada"] };

const normalizar = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

async function converter(origem, idDestino) {
  const destino = path.join(SAIDA, `${idDestino}.webp`);
  await sharp(origem)
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(destino);
  const { size } = await stat(destino);
  console.log(`  ${idDestino}.webp  (${(size / 1024).toFixed(0)} KB)`);
}

await mkdir(SAIDA, { recursive: true });

const arquivos = await readdir(PUBLIC);
const pngs = arquivos.filter((f) => f.toLowerCase().endsWith(".png"));

const origemPorId = {};
let ok = 0;
for (const arquivo of pngs) {
  const base = normalizar(arquivo.replace(/\.png$/i, ""));
  const id = MAPA[base];
  if (!id) {
    console.log(`! sem mapeamento: ${arquivo}`);
    continue;
  }
  const origem = path.join(PUBLIC, arquivo);
  origemPorId[id] = origem;
  await converter(origem, id);
  ok++;
}

// Reaproveitamentos
for (const [idOrigem, extras] of Object.entries(REAPROVEITAR)) {
  const origem = origemPorId[idOrigem];
  if (!origem) continue;
  for (const idExtra of extras) {
    await converter(origem, idExtra);
    ok++;
  }
}

console.log(`\nConvertidos: ${ok} arquivo(s) em public/cortes/`);
