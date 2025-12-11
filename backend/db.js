const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    console.warn("Warning: DATABASE_URL is not set");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Om du använder EXTERNAL DB URL + SSL:
    // ssl: { rejectUnauthorized: false }
    // För INTERNAL DB URL (som du gör nu) ska ssl vara av:
    ssl: false
});

async function init() {
    // Skapa enkel users-tabell om den inte finns
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
    console.log("Database initialized (users table ready)");
}

function query(text, params) {
    return pool.query(text, params);
}

module.exports = {
    init,
    query
};
