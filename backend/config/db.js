const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false  // For Render Internal DB URL
});

module.exports = pool;
