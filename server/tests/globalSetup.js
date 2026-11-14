// Crée le schéma une fois avant toute la suite de tests API.
const { ensureSchema } = require('../dbSetup');

module.exports = async () => {
    const pool = require('../db');
    try {
        await ensureSchema(pool);
    } finally {
        await pool.end();
    }
};
