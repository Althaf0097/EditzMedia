# Database Scripts

Utility scripts for managing the EditzMedia database.

## Prerequisites

```bash
npm install dotenv pg
```

## Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ADMIN_EMAIL=your-email@example.com
   ```

3. **NEVER commit `.env.local` to Git!**

## Available Scripts

### `setup_db.js`
Sets up the initial database schema.

```bash
node scripts/setup_db.js
```

### `promote_admin.js`
Promotes a user to admin status.

```bash
# Set ADMIN_EMAIL in .env.local first
node scripts/promote_admin.js
```

### `run_migration.js`
Runs the display name migration.

```bash
node scripts/run_migration.js
```

### `run_saved_items_migration.js`
Creates the saved_items table.

```bash
node scripts/run_saved_items_migration.js
```

### `run_bucket_fix.js`
Fixes storage bucket permissions.

```bash
node scripts/run_bucket_fix.js
```

## Security Notes

- All scripts use environment variables from `.env.local`
- Never hardcode credentials in these files
- If you need to share scripts, use `.env.example` as a template
- Rotate your database password if credentials are ever exposed

## Troubleshooting

**Error: "DATABASE_URL not set"**
- Ensure `.env.local` exists in the project root
- Check that `DATABASE_URL` is defined in `.env.local`

**Error: "Connection refused"**
- Verify your database connection string is correct
- Check that your IP is allowed in Supabase settings
- Ensure the database is running
