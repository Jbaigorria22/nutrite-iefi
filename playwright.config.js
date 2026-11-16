// Configuración de Playwright para los tests end-to-end (E2E).
// Levanta el sitio con un servidor local y lo recorre con Chromium como un usuario real.

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1, // de a un test por vez: las capturas quedan en orden
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    viewport: { width: 1366, height: 768 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } } }],
  webServer: {
    command: "node e2e/servidor.js",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
