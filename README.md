# demo-app-portfolio : une petite application et sa stratégie de test

[![Tests](https://github.com/doqa-io/demo-app-portfolio/actions/workflows/tests.yml/badge.svg)](https://github.com/doqa-io/demo-app-portfolio/actions/workflows/tests.yml)

Application de démonstration de [doqa.io](https://doqa.io). Le sujet n'est pas l'application elle-même, volontairement simple, mais la façon dont elle est testée : tests d'API, tests de composants, tests de bout en bout et intégration continue.

## Ce que fait l'application

- **Une API REST** (Node.js, Express, PostgreSQL) qui gère des « ressources » identifiées par un nom : liste, lecture, création, modification et suppression.
- **Un front React** avec une page d'accueil et un écran de gestion des ressources (lister, ajouter, supprimer).
- **Une documentation Swagger** de l'API, avec « Try it out » sur le serveur en cours d'exécution.
- **Une page d'état du back-end** qui indique si la base de données répond.

L'application n'a ni comptes utilisateurs ni authentification. La modification d'une ressource n'existe que dans l'API, pas encore dans l'interface.

## Architecture

```text
client/   Front React (Create React App, Tailwind CSS)
server/   API Express + PostgreSQL, documentation Swagger (swagger.json)
e2e/      Tests de bout en bout Playwright
.github/workflows/tests.yml   Intégration continue
docker-compose.yml            Base PostgreSQL locale et jetable
```

| Route | Rôle |
|---|---|
| `GET /api/resources` | Liste des ressources |
| `POST /api/resources` | Création (`{ "name": "..." }`, 1 à 100 caractères) |
| `GET /api/resources/:id` | Lecture |
| `PUT /api/resources/:id` | Modification |
| `DELETE /api/resources/:id` | Suppression |
| `GET /api/health` | État du back-end et de la base |
| `GET /api/docs` | Documentation Swagger |
| `GET /api` | Page d'accueil du back-end |

Les entrées invalides (identifiant non entier, nom absent, vide ou trop long, JSON mal formé) reçoivent une réponse `400` avec un message d'erreur, et non une erreur serveur.

Le schéma de la base est créé automatiquement au démarrage du serveur et avant les tests.

## Lancer l'application

Prérequis : Node.js 20 ou plus, Docker.

```bash
npm run setup     # installe les dépendances (racine, server, client)
npm start         # démarre PostgreSQL, construit le front et sert le tout sur http://localhost:4000
```

En développement, avec rechargement automatique du front sur http://localhost:3000 :

```bash
npm run dev
```

La configuration par défaut (`server/.env.example`) correspond à la base de `docker-compose.yml`. Pour la modifier, copiez ce fichier en `server/.env`. `npm run db:down` arrête la base et efface ses données.

## Stratégie de test

| Niveau | Outil | Ce qui est vérifié | Commande |
|---|---|---|---|
| API | Jest + Supertest, vraie base PostgreSQL | Chaque route, les cas d'erreur (`400`, `404`, `500`, `503`), la validation des entrées, l'absence de secret dans les logs | `npm run test:api` |
| Composants | Jest + Testing Library, axios simulé | Page d'accueil, écran des ressources : chargement, ajout, suppression, messages d'erreur | `npm run test:client` |
| Bout en bout | Playwright, Chrome desktop et Pixel 7 | Parcours CRUD complet dans le navigateur, vérifié après rechargement et dans l'API ; navigation ; page d'état ; Swagger « Try it out » sur le serveur local | `npm run test:e2e:full` |

Les tests de bout en bout tournent sur l'application lancée en local, jamais sur la production. Playwright démarre lui-même le serveur Express, qui sert l'API et le build du front. Chaque test crée ses propres données avec un nom unique et les supprime ensuite, ce qui permet de lancer les tests en parallèle sur la même base.

`npm run test:e2e:full` démarre la base et construit le front avant les tests. Si c'est déjà fait, `npm run test:e2e` suffit. Le rapport HTML est dans `playwright-report/` (`npx playwright show-report`).

Anomalie connue : en mobile, la page d'accueil déborde horizontalement. Le test correspondant est marqué `fixme` dans `e2e/landing.spec.js` en attendant la correction.

## Intégration continue

Le workflow `tests.yml` s'exécute sur chaque pull request et sur chaque push sur `main`, sans aucun secret. Il comporte trois jobs :

1. **API** : tests Jest et Supertest sur un PostgreSQL jetable.
2. **Front** : tests Jest, puis build de production (ESLint inclus).
3. **Bout en bout** : tests Playwright sur le build, avec un PostgreSQL jetable.

Les rapports de couverture, le rapport Playwright et les traces des échecs sont conservés en artefacts.

Le déploiement (`deploy.yml`) est un workflow distinct.
