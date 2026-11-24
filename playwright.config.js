const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:8766/eraf-web/',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && node scripts/serve.cjs --port 8766 --base /eraf-web/',
    url: 'http://127.0.0.1:8766/eraf-web/',
  },
});
