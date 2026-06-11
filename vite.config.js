import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Local backend for dev proxy (override in .env.development if needed)
  const apiTarget = env.VITE_DEV_PROXY_TARGET || "http://127.0.0.1:8000";

  return {
    plugins: [
      react(),

      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: "Presenza Attendance System",
          short_name: "Presenza",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#2563eb",
          description: "Smart QR-based attendance system",
          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],

    server: {
      host: true,
      port: 5173,
      historyApiFallback: true,

      proxy: {
        "/auth": { target: apiTarget, changeOrigin: true },
        "/cr": { target: apiTarget, changeOrigin: true },
        "/students": { target: apiTarget, changeOrigin: true },
        // IMPORTANT: do NOT proxy /admin to backend.
        // Admin pages are React routes; proxying them can cause FastAPI 404s on refresh.
        // "\/admin": { target: apiTarget, changeOrigin: true },


        "/static": { target: apiTarget, changeOrigin: true },
        "/student/api": { target: apiTarget, changeOrigin: true },
      },
    },
  };
});
