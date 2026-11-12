// Outils partagés : noms uniques et nettoyage par l'API, pour que les tests
// restent indépendants même en parallèle sur la même base.

function uniqueName(testInfo, label) {
    return `${label} ${testInfo.project.name}-${testInfo.workerIndex}-${Date.now()}`;
}

async function createResource(request, name) {
    const res = await request.post('/api/resources', { data: { name } });
    if (res.status() !== 201) throw new Error(`Unable to create "${name}": ${res.status()}`);
    return res.json();
}

async function deleteResourcesNamed(request, prefix) {
    const res = await request.get('/api/resources');
    const resources = await res.json();
    await Promise.all(
        resources
            .filter((resource) => resource.name.startsWith(prefix))
            .map((resource) => request.delete(`/api/resources/${resource.id}`))
    );
}

module.exports = { uniqueName, createResource, deleteResourcesNamed };
