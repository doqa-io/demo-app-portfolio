// @ts-check
const { test, expect } = require('@playwright/test');
const { uniqueName, createResource, deleteResourcesNamed } = require('./helpers');

// Parcours CRUD complet sur l'application lancée en local.
// L'interface permet de créer, lister et supprimer ; la modification n'existe
// que dans l'API, elle est donc faite par l'API puis vérifiée dans l'interface.
test.describe('Gestion des ressources', () => {
    let prefix;

    const items = (page) => page.getByTestId('resource-item');
    const input = (page) => page.getByPlaceholder('Enter resource name');
    const addButton = (page) => page.getByRole('button', { name: 'Add Resource' });

    test.beforeEach(async ({ page }, testInfo) => {
        prefix = uniqueName(testInfo, 'e2e');
        await page.goto('/resources');
        await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
    });

    test.afterEach(async ({ request }) => {
        await deleteResourcesNamed(request, prefix);
    });

    test("créer une ressource depuis l'interface : elle s'affiche et elle est enregistrée", async ({ page, request }) => {
        const name = `${prefix} created`;
        await input(page).fill(name);
        await addButton(page).click();

        await expect(items(page).filter({ hasText: name })).toHaveCount(1);
        await expect(input(page)).toHaveValue('');

        await page.reload();
        await expect(items(page).filter({ hasText: name })).toHaveCount(1);

        const all = await (await request.get('/api/resources')).json();
        expect(all.filter((r) => r.name === name)).toHaveLength(1);
    });

    test("lire : une ressource créée par l'API apparaît dans la liste", async ({ page, request }) => {
        const name = `${prefix} listed`;
        await createResource(request, name);
        await page.reload();
        await expect(items(page).filter({ hasText: name })).toHaveCount(1);
    });

    test("modifier par l'API : le nouveau nom apparaît dans l'interface", async ({ page, request }) => {
        const created = await createResource(request, `${prefix} before`);
        const res = await request.put(`/api/resources/${created.id}`, { data: { name: `${prefix} after` } });
        expect(res.status()).toBe(200);

        await page.reload();
        await expect(items(page).filter({ hasText: `${prefix} after` })).toHaveCount(1);
        await expect(items(page).filter({ hasText: `${prefix} before` })).toHaveCount(0);
    });

    test("supprimer depuis l'interface : la ressource disparaît, aussi après rechargement", async ({ page, request }) => {
        const name = `${prefix} deleted`;
        const created = await createResource(request, name);
        await page.reload();

        const item = items(page).filter({ hasText: name });
        await item.getByRole('button', { name: 'Delete' }).click();
        await expect(item).toHaveCount(0);

        await page.reload();
        await expect(items(page).filter({ hasText: name })).toHaveCount(0);
        expect((await request.get(`/api/resources/${created.id}`)).status()).toBe(404);
    });

    test("un nom vide est refusé sans appel à l'API", async ({ page }) => {
        let posted = false;
        page.on('request', (req) => {
            if (req.method() === 'POST' && req.url().endsWith('/api/resources')) posted = true;
        });
        await addButton(page).click();
        await expect(page.getByText('Resource name cannot be empty')).toBeVisible();
        expect(posted).toBe(false);
    });

    test("un nom trop long est refusé par l'API et l'erreur s'affiche", async ({ page }) => {
        await input(page).fill(`${prefix} ${'x'.repeat(100)}`);
        const response = page.waitForResponse(
            (res) => res.url().endsWith('/api/resources') && res.request().method() === 'POST'
        );
        await addButton(page).click();
        expect((await response).status()).toBe(400);
        await expect(page.getByText('Failed to add resource')).toBeVisible();
        await expect(items(page).filter({ hasText: prefix })).toHaveCount(0);
    });

    test("si l'API est indisponible, un message d'erreur s'affiche", async ({ page }) => {
        await page.route('**/api/resources', (route) =>
            route.fulfill({ status: 500, json: { error: 'Internal Server Error' } })
        );
        await page.reload();
        await expect(page.getByText('Failed to load resources')).toBeVisible();
    });
});
