import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  resolve: {
    // Resolve os aliases do tsconfig (@/*) nativamente.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
