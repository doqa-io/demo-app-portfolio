require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const pool = require('./db');
const { ensureSchema } = require('./dbSetup');
const swaggerDocument = require('./swagger.json');

const app = express();
const api = express.Router();

app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 4000;
const NAME_MAX_LENGTH = 100; // aligné sur VARCHAR(100) dans dbSetup.js
const PG_INT_MAX = 2147483647;

// Renvoie l'identifiant entier positif, ou null s'il est invalide.
function parseId(raw) {
    if (!/^\d+$/.test(raw)) return null;
    const id = Number(raw);
    return id >= 1 && id <= PG_INT_MAX ? id : null;
}

// Renvoie { name } nettoyé, ou { error } si le corps est invalide.
function validateResourceBody(body) {
    const name = body && typeof body === 'object' ? body.name : undefined;
    if (name === undefined || name === null) return { error: "Name is required" };
    if (typeof name !== 'string') return { error: "Name must be a string" };
    const trimmed = name.trim();
    if (!trimmed) return { error: "Name is required" };
    if (trimmed.length > NAME_MAX_LENGTH) {
        return { error: `Name must be at most ${NAME_MAX_LENGTH} characters` };
    }
    return { name: trimmed };
}

// Valide :id pour toutes les routes /resources/:id
api.param('id', (req, res, next, raw) => {
    const id = parseId(raw);
    if (id === null) return res.status(400).json({ error: "Invalid id" });
    req.resourceId = id;
    next();
});

// Toute l'API est servie sous /api, comme l'appelle le front.

// Page d'accueil du back-end
api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'landing.html'));
});

// État du back-end et de la base, lu par la page d'accueil
api.get('/health', async (req, res) => {
    const services = { backend: 'Active', database: 'Connected' };
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ services });
    } catch (err) {
        console.error('Database connection error:', err.message);
        services.database = 'Disconnected';
        res.status(503).json({ services });
    }
});

// Swagger documentation
api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// GET /api/resources: list all resources
api.get('/resources', async (req, res) => {
    try {
        const dbRes = await pool.query('SELECT * FROM resources ORDER BY id');
        res.status(200).json(dbRes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/resources: Add a new resource
api.post('/resources', async (req, res) => {
    const { name, error } = validateResourceBody(req.body);
    if (error) return res.status(400).json({ error });

    try {
        const dbRes = await pool.query(
            'INSERT INTO resources (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(dbRes.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/resources/:id: Fetch a specific resource by ID
api.get('/resources/:id', async (req, res) => {
    const id = req.resourceId;

    try {
        const dbRes = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);

        if (dbRes.rows.length === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }

        res.status(200).json(dbRes.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/resources/:id: Update a resource by ID
api.put('/resources/:id', async (req, res) => {
    const id = req.resourceId;
    const { name, error } = validateResourceBody(req.body);
    if (error) return res.status(400).json({ error });

    try {
        const dbRes = await pool.query(
            'UPDATE resources SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );

        if (dbRes.rows.length === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }

        res.status(200).json(dbRes.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /api/resources/:id: Delete a resource by ID
api.delete('/resources/:id', async (req, res) => {
    const id = req.resourceId;

    try {
        const dbRes = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);

        if (dbRes.rows.length === 0) {
            return res.status(404).json({ error: "Resource not found" });
        }

        res.status(200).json({ message: "Resource deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use('/api', api);

// Corps JSON mal formé : erreur du client, pas du serveur
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: "Malformed JSON body" });
    }
    return next(err);
});
app.use('/static', express.static(path.join(__dirname, 'static')));

// Optionnel : sert le build React (client/build) depuis le même processus,
// pour un lancement en une commande et pour les tests de bout en bout.
const clientBuildDir = process.env.CLIENT_BUILD_DIR
    ? path.resolve(__dirname, process.env.CLIENT_BUILD_DIR)
    : null;
if (clientBuildDir && fs.existsSync(path.join(clientBuildDir, 'index.html'))) {
    app.use(express.static(clientBuildDir));
    // Routage côté client : toute route hors /api renvoie index.html
    app.get(/^\/(?!api(\/|$)).*/, (req, res) => {
        res.sendFile(path.join(clientBuildDir, 'index.html'));
    });
}

// Start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    ensureSchema(pool)
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Backend server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('Unable to prepare the database schema:', err.message);
            process.exit(1);
        });
}

// Export app and pool for testing
module.exports = { app, pool };
