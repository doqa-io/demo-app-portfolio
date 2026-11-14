// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Les tests de bout en bout tournent sur l'application lancée en local :
// l'API Express sert aussi le build React (client/build), sur un port dédié.
// Prérequis : base démarrée (npm run db:up) et front construit (npm run build).
const PORT = Number(process.env.E2E_PORT || 4173);
const baseURL = `http://localhost:${PORT}`;

module.exports = defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI
        ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
        : [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    webServer: {
        command: 'npm --prefix server start',
        url: `${baseURL}/api/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        env: {
            PORT: String(PORT),
            CLIENT_BUILD_DIR: '../client/build',
            ...(process.env.DATABASE_URL ? { DATABASE_URL: process.env.DATABASE_URL } : {}),
        },
    },
});
