const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.warn('⚠️  Warning: DATABASE_URL is not set');
    console.warn('   For local development, create backend/.env with:');
    console.warn('   DATABASE_URL=postgresql://user:password@localhost:5432/dbname');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false  // For Render Internal DB URL
});

async function init() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS meetups (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date TIMESTAMPTZ NOT NULL,
                location VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                capacity INTEGER NOT NULL DEFAULT 0,
                host_id INTEGER REFERENCES users(id),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                meetup_id INTEGER REFERENCES meetups(id),
                registered_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, meetup_id)
            );

            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                meetup_id INTEGER REFERENCES meetups(id),
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, meetup_id)
            );
        `);
        console.log('✅ Database initialized (all tables ready)');
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.warn('   Server will start but database operations will fail.');
        console.warn('   This is OK for testing non-DB endpoints like /health');
    }
}

function query(text, params) {
    return pool.query(text, params);
}

module.exports = {
    init,
    query,
    pool  // Export pool for backward compatibility with controllers
};
