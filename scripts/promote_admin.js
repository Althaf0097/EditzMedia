require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
const emailToPromote = process.env.ADMIN_EMAIL;

if (!connectionString || !emailToPromote) {
    console.error('❌ ERROR: Required environment variables not set.');
    console.error('Required: DATABASE_URL, ADMIN_EMAIL');
    console.error('See .env.example for required format.');
    process.exit(1);
}

async function promoteUser() {
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log(`✅ Connected. Promoting ${emailToPromote}...`);

        const res = await client.query(
            `UPDATE profiles SET is_admin = true WHERE email = $1 RETURNING *`,
            [emailToPromote]
        );

        if (res.rowCount > 0) {
            console.log(`✅ Success! ${emailToPromote} is now an admin.`);
        } else {
            console.log(`⚠️  User ${emailToPromote} not found. Ensure they've signed up first.`);
        }

    } catch (err) {
        console.error('❌ Error promoting user:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

promoteUser();
