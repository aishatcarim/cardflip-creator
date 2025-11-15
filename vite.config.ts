import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@auth": path.resolve(__dirname, "./src/features/auth"),
      "@profile": path.resolve(__dirname, "./src/features/profile"),
      "@contacts": path.resolve(__dirname, "./src/features/contacts"),
      "@events": path.resolve(__dirname, "./src/features/events"),
      "@analytics": path.resolve(__dirname, "./src/features/analytics"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@lib": path.resolve(__dirname, "./src/shared/lib"),
    },
  },
}));
