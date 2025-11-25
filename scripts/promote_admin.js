const { Client } = require('pg');

const connectionString = 'postgresql://postgres:althaf@123@db.thdsfipfnojdxzwelbri.supabase.co:5432/postgres';
const emailToPromote = 'althafs2121@gmail.com';

async function promoteUser() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log(`Connected to database. Promoting ${emailToPromote}...`);

        const res = await client.query(
            `UPDATE profiles SET is_admin = true WHERE email = $1 RETURNING *`,
            [emailToPromote]
        );

        if (res.rowCount > 0) {
            console.log(`Success! User ${emailToPromote} is now an admin.`);
        } else {
            console.log(`User ${emailToPromote} not found. Make sure they have signed up first.`);
        }

    } catch (err) {
        console.error('Error promoting user:', err);
    } finally {
        await client.end();
    }
}

promoteUser();
