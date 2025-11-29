require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ ERROR: DATABASE_URL not set in .env.local');
    console.error('See .env.example for required format.');
    process.exit(1);
}

async function setupDatabase() {
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('✅ Connected to database.');

        const sqlPath = path.join(__dirname, '..', 'supabase_setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔄 Running SQL setup script...');
        await client.query(sql);
        console.log('✅ Database setup completed successfully.');

    } catch (err) {
        console.error('❌ Error setting up database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupDatabase();
