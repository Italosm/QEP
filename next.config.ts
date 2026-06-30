import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Força a Vercel a empacotar o arquivo do SQLite no servidor
  outputFileTracingIncludes: {
    "/*": ["./prisma/**/*"],
  },

  // 2. Garante que o Prisma funcione perfeitamente no ambiente Serverless
  serverExternalPackages: ["@prisma/client", "prisma"],

  // 3. Suas configurações de imagens que já estavam certas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.camara.leg.br",
        pathname: "/internet/deputado/bandep/**",
      },
      {
        protocol: "https",
        hostname: "www.senado.leg.br",
        pathname: "/senadores/img/fotos-oficiais/**",
      },
    ],
  },
};

export default nextConfig;
