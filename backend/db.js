const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.warn('Warning: DATABASE_URL is not set');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false  // For Render Internal DB URL
});

async function init() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
    console.log('Database initialized (users table ready)');
}

function query(text, params) {
    return pool.query(text, params);
}

module.exports = {
    init,
    query,
    pool  // Export pool for backward compatibility with controllers
};
