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

        const sqlPath = path.join(__dirname, 'fix_bucket_public.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running bucket fix...');
        await client.query(sql);
        console.log('Bucket fix applied successfully.');

    } catch (err) {
        console.error('Error running fix:', err);
    } finally {
        await client.end();
    }
}

runMigration();
