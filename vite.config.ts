// The shared config supplies the Vite and TanStack plugins; Nitro is pinned to Vercel.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: { preset: "vercel" },
  vite: {
    server: {
      host: "127.0.0.1",
      port: 8080,
      strictPort: false,
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts.
    server: { entry: "server" },
  },
});
