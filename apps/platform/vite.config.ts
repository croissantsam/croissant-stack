import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  plugins: [
    nitro(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        // In this version of TanStack Start, we use 'filter' to specify ISR routes
        filter: ({ path }) => ["/", "/login", "/signup", "/examples/isr"].includes(path),
      },
    }),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

export default config;
