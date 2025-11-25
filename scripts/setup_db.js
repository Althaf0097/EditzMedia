const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:althaf@123@db.thdsfipfnojdxzwelbri.supabase.co:5432/postgres';

async function setupDatabase() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, '..', 'supabase_setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running SQL setup script...');
        await client.query(sql);
        console.log('Database setup completed successfully.');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
