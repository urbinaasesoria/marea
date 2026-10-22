import { defineConfig } from "@playwright/test";

/**
 * Smoke-level end-to-end coverage for Marea.
 *
 * The suite rides on the Vite dev server, which is fast and matches local
 * verification (`npm run verify`). In CI the server is started fresh and the
 * browser retries once before a test is declared flaky.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:5173",
    browserName: "chromium",
    viewport: { width: 1280, height: 800 },
    locale: "en-US",
    // Any uncaught page error fails the test that observed it.
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://localhost:5173/",
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
});
