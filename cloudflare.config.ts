import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "linearlens",
    compatibilityDate: "2026-10-01",
    workersDev: true,
    assets: {
      htmlHandling: "auto-trailing-slash",
      notFoundHandling: "404-page",
    },
  },
});
