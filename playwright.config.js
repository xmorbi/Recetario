import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js', 
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
  },
});