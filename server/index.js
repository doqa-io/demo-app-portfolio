require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000;

// Route to display a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the doqa.io backend!');
});

// GET /api/resources endpoint
app.get('/api/resources', async (req, res) => {
    try {
        const dbRes = await pool.query('SELECT * FROM resources');
        res.status(200).json(dbRes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/resources: Add a new resource
app.post('/api/resources', async (req, res) => {
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
app.get('/api/resources/:id', async (req, res) => {
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
app.put('/api/resources/:id', async (req, res) => {
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
app.delete('/api/resources/:id', async (req, res) => {
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

// Start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

// Export app and pool for testing
module.exports = { app, pool };
