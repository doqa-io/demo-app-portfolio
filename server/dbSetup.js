// dbSetup.js
const pool = require('./db');

async function createTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS resources (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        )
    `);
    console.log('Table created or already exists');
}

createTable()
    .catch((err) => console.error('Error creating table', err))
    .finally(() => pool.end());
