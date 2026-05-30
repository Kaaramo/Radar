import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone : requis par infra/docker/web/Dockerfile (stage runner).
  // Génère apps/web/.next/standalone/server.js + tout ce qu'il faut pour run
  // sans node_modules complets → image Docker ~200MB au lieu de ~1GB.
  output: "standalone",
};

export default nextConfig;
