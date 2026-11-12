// dbSetup.js : crée le schéma de la base s'il n'existe pas encore.
// Utilisé au démarrage du serveur, avant les tests (globalSetup Jest)
// et en ligne de commande : `npm run db:setup`.
const SCHEMA_SQL = `
    CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    )
`;

async function ensureSchema(pool) {
    await pool.query(SCHEMA_SQL);
}

module.exports = { ensureSchema };

if (require.main === module) {
    const pool = require('./db');
    ensureSchema(pool)
        .then(() => console.log('Schema ready'))
        .catch((err) => {
            console.error('Error creating schema:', err.message);
            process.exitCode = 1;
        })
        .finally(() => pool.end());
}
