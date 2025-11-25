const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read connection string from env_config.txt or .env.local if possible, 
// but for now we'll use the one we know or ask user to provide it if needed.
// Actually, we can try to parse it from the previous setup script or just hardcode it since the user provided it recently.
// User provided: postgresql://postgres:althaf@123@db.thdsfipfnojdxzwelbri.supabase.co:5432/postgres

const connectionString = 'postgresql://postgres:althaf@123@db.thdsfipfnojdxzwelbri.supabase.co:5432/postgres';

async function runMigration() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, 'migration_add_display_name.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration...');
        await client.query(sql);
        console.log('Migration completed successfully.');

    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
