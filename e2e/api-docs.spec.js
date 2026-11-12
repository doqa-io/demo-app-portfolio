// @ts-check
const { test, expect } = require('@playwright/test');

test.describe("Documentation de l'API (Swagger)", () => {
    test('liste les opérations sur les ressources', async ({ page }) => {
        await page.goto('/api/docs/');
        await expect(page.getByRole('heading', { name: /Doqa\.io API/ })).toBeVisible();
        for (const [method, path] of [
            ['get', '/resources'],
            ['post', '/resources'],
            ['get', '/resources/{id}'],
            ['put', '/resources/{id}'],
            ['delete', '/resources/{id}'],
        ]) {
            await expect(
                page.locator(`.opblock-${method}`).filter({ has: page.locator(`[data-path="${path}"]`) })
            ).toHaveCount(1);
        }
    });

    test('« Try it out » interroge le serveur local, pas la production', async ({ page, baseURL }) => {
        await page.goto('/api/docs/');
        const operation = page.locator('.opblock-get').filter({ has: page.locator('[data-path="/resources"]') });
        await operation.locator('.opblock-summary').click();
        await operation.getByRole('button', { name: 'Try it out' }).click();

        const response = page.waitForResponse((res) => res.url() === `${baseURL}/api/resources`);
        await operation.getByRole('button', { name: 'Execute' }).click();
        expect((await response).status()).toBe(200);
        await expect(operation.locator('.live-responses-table tbody td.response-col_status').first()).toHaveText('200');
    });
});
