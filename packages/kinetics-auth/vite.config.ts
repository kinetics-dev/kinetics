import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      root: resolve(process.cwd(), "cypress"),
      plugins: [react({ jsxRuntime: "automatic" })],
      optimizeDeps: {
        include: ["in-memory-storage"],
      },
    };
  }

  return {
    // React runtime is not being injected automatically with `jsxRuntime: automatic`
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
    plugins: [
      react({
        jsxRuntime: "classic",
      }),
    ],
    optimizeDeps: {
      include: ["in-memory-storage"],
    },
    build: {
      // https://github.com/vitejs/vite/issues/6555
      minify: true,
      commonjsOptions: {
        include: [/in-memory-storage/],
      },
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "@kinetics-dev/auth",
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
          },
        },
      },
    },
  };
});
