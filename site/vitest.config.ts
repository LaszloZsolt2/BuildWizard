import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts", // Itt biztosítjuk, hogy a setup fájl betöltődjön
  },
});
