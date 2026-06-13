import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace neste projeto (há um package-lock.json solto
  // no diretório do usuário que confundia a detecção automática).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
