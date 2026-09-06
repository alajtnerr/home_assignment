// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /*Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /*
   * In CI, let Playwright manage starting both services itself (more
   * robust process/port handling than a hand-rolled background+wait-on
   * script). Locally, services are started manually (see README) — this
   * avoided some Windows-specific flakiness with Playwright's webServer
   * during development.
   */
  webServer: process.env.CI
    ? [
        {
          command: 'node index.js',
          cwd: './mock-backend',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: false,
          timeout: 120 * 1000,
        },
        {
          command: 'npx ng serve',
          cwd: './mock-app',
          url: 'http://127.0.0.1:4200',
          reuseExistingServer: false,
          timeout: 120 * 1000,
        },
      ]
    : undefined,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/tasks-api.spec.js',
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: '**/tasks-api.spec.js',
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/tasks-api.spec.js',
    },

    /* Pure API tests don't need a browser — run once, not per-browser. */
    {
      name: 'api',
      testMatch: '**/tasks-api.spec.js',
    },
  ],
});