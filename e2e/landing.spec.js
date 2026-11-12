// @ts-check
const { test, expect } = require('@playwright/test');

test.describe("Page d'accueil", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('affiche le titre, le message principal et la navigation', async ({ page }) => {
        await expect(page).toHaveTitle('DoQA.io, a place to showcase QA');
        await expect(page.getByRole('heading', { level: 1, name: 'doqa.io' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Showcasing Excellence in QA' })).toBeVisible();

        const nav = page.getByRole('navigation');
        for (const label of ['Home', 'API', 'Resources', 'Contact']) {
            await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
        }
    });

    test('le bouton « Go to CRUD Resources » ouvre la gestion des ressources', async ({ page }) => {
        await page.getByRole('link', { name: 'Go to CRUD Resources' }).click();
        await expect(page).toHaveURL(/\/resources$/);
        await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
    });

    test("le lien « API » mène à l'accueil du back-end, base connectée", async ({ page }) => {
        await page.getByRole('navigation').getByRole('link', { name: 'API', exact: true }).click();
        await expect(page).toHaveURL(/\/api$/);
        await expect(page.getByRole('heading', { name: 'Welcome to the doqa.io Backend' })).toBeVisible();
        await expect(page.locator('#backend-status')).toHaveText('Active');
        await expect(page.locator('#database-status')).toHaveText('Connected');
    });

    test('ne déborde pas horizontalement', async ({ page }, testInfo) => {
        // Anomalie connue : en mobile (Pixel 7), la barre de navigation et les
        // trois cartes « Why Choose Us? » restent sur une ligne et débordent.
        test.fixme(
            testInfo.project.name === 'mobile',
            'Débordement horizontal connu en mobile, à corriger dans LandingPage.js'
        );
        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow).toBeLessThanOrEqual(0);
    });
});
