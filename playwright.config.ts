import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright smoke-test configuration.
 * Assumes `next dev` is running locally on port 3000.
 * Run with: npx playwright test
 */
export default defineConfig({
  testDir:     './e2e',
  fullyParallel: false,
  retries:     1,
  timeout:     30_000,

  use: {
    baseURL:  process.env.BASE_URL ?? 'http://localhost:3000',
    trace:    'on-first-retry',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start the dev server automatically when running e2e tests
  webServer: {
    command: 'npm run dev',
    port:    3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
