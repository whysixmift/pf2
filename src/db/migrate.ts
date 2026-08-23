import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  console.log('🔄 Connecting to PostgreSQL database for migration...');
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 10000 });

  try {
    const db = drizzle(pool, { schema });
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connection verified.');

    // Note: drizzle-kit push is used via CLI in deploy script for automatic schema synchronization.
    // This file provides programmatic migration checks and table initialization if needed.
    
    // Seed default settings if empty
    const existingSettings = await db.select().from(schema.settings);
    if (existingSettings.length === 0) {
      console.log('🌱 Seeding initial settings...');
      await db.insert(schema.settings).values([
        { key: 'siteName', value: 'My Portfolio' },
        { key: 'siteDescription', value: 'Robotics, software, and engineering projects.' }
      ]);
    }

    console.log('✅ Migration & seeding check complete.');
    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

main();
