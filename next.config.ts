import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportação estática (gera /out) — preset "Next.js Static HTML Export" na
  // Cloudflare Pages. Sem Workers, sem nodejs_compat.
  output: "export",
  // Sem otimização de imagem no servidor (não existe no export estático).
  images: {
    unoptimized: true,
  },
  // Fixa a raiz do workspace neste projeto (há um package-lock.json solto
  // no diretório do usuário que confundia a detecção automática).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
