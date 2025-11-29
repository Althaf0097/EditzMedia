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

async function fixBucket() {
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('✅ Connected to database.');

        const sqlPath = path.join(__dirname, 'fix_bucket_public.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🔄 Running bucket fix...');
        await client.query(sql);
        console.log('✅ Bucket fix completed successfully.');

    } catch (err) {
        console.error('❌ Error fixing bucket:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

fixBucket();
