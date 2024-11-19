// index.js
require('dotenv').config();
const express = require('express');
const app = express();
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

// Start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

module.exports = app; // Export the app for testing
