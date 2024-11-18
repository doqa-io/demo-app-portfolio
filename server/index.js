// server/index.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the doqa.io backend!');
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
