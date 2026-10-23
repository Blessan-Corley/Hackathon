import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 800 }
  },
  webServer: {
    command: 'node ../server/dist/server.js',
    url: 'http://localhost:4000/api/metrics',
    reuseExistingServer: true,
    timeout: 15000
  }
});
