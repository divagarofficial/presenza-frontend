import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,

    // ✅ SPA fallback (FIXES REFRESH ISSUE)
    historyApiFallback: true,

    proxy: {
      // ✅ AUTH APIs
      "/auth": {
        target: "http://192.168.212.188:8000",
        changeOrigin: true,
      },

      // ✅ CR APIs
      "/cr": {
        target: "http://192.168.212.188:8000",
        changeOrigin: true,
      },

      // ✅ ADMIN APIs (IMPORTANT FIX)
      "/admin/api": {
        target: "http://192.168.212.188:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace("/admin/api", "/admin"),
      },

      // ✅ STUDENT APIs
      "/student/api": {
        target: "http://192.168.212.188:8000",
        changeOrigin: true,
      },
    },
  },
});
