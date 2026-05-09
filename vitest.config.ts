import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/api.ts",
        "src/lib/scoring.ts",
        "src/lib/nextStep.ts",
        "src/lib/categoryMeta.ts",
        "src/lib/utils.ts",
        "src/hooks/useAuditFlow.ts",
        "src/hooks/useCopyToClipboard.ts",
        "src/components/landing/UrlForm.tsx",
        "src/components/EmailGateModal.tsx",
        "src/components/CopyButton.tsx",
      ],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
