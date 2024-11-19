require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000;

// Placeholder data for resources
const resources = [];

// Route to display a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the doqa.io backend!');
});

// GET /api/resources endpoint
app.get('/api/resources', (req, res) => {
    res.status(200).json(resources); // Send the empty array as JSON with a 200 status
});

// POST /api/resources: Add a new resource
app.post('/api/resources', (req, res) => {
    const { id, name } = req.body;

    // Basic validation
    if (!id || !name) {
        return res.status(400).json({ error: "Resource validation failed" });
    }

    const newResource = { id, name };
    resources.push(newResource);

    res.status(201).json(newResource);
});

// GET /api/resources/:id: Fetch a specific resource by ID
app.get('/api/resources/:id', (req, res) => {
    const resource = resources.find(r => r.id === parseInt(req.params.id, 10));

    if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json(resource);
});

// PUT /api/resources/:id: Update a resource by ID
app.put('/api/resources/:id', (req, res) => {
    const resource = resources.find(r => r.id === parseInt(req.params.id, 10));

    if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
    }

    const { name } = req.body;
    resource.name = name || resource.name; // Update the name if provided

    res.status(200).json(resource);
});

// DELETE /api/resources/:id: Delete a resource by ID
app.delete('/api/resources/:id', (req, res) => {
    const resourceIndex = resources.findIndex(r => r.id === parseInt(req.params.id, 10));

    if (resourceIndex === -1) {
        return res.status(404).json({ error: "Resource not found" });
    }

    resources.splice(resourceIndex, 1);
    res.status(200).json({ message: "Resource deleted" });
});


// Start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

module.exports = app; // Export the app for testing
