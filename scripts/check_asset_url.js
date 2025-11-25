const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestAsset() {
    const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('asset_type', 'image')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching asset:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Latest Asset:', data[0]);
        console.log('File URL:', data[0].file_url);
    } else {
        console.log('No assets found.');
    }
}

checkLatestAsset();
