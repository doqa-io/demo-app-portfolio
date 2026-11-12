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
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

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
    const { id } = req.params;

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
    const { id } = req.params;
    const { name } = req.body;

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
    const { id } = req.params;

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
