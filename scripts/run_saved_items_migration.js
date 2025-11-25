const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:althaf@123@db.thdsfipfnojdxzwelbri.supabase.co:5432/postgres';

async function runMigration() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, 'migration_saved_items.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running saved_items migration...');
        await client.query(sql);
        console.log('Migration completed successfully.');

    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
