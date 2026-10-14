import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local', override: true });

async function main() {
    const url = process.env.DATABASE_URL;
    if (url) {
        const { neon } = await import('@neondatabase/serverless');
        const { drizzle } = await import('drizzle-orm/neon-http');
        const { migrate } = await import('drizzle-orm/neon-http/migrator');
        await migrate(drizzle(neon(url)), { migrationsFolder: './drizzle' });
        console.log('✓ Neon bazasiga migratsiyalar qo‘llandi');
    } else {
        const { PGlite } = await import('@electric-sql/pglite');
        const { drizzle } = await import('drizzle-orm/pglite');
        const { migrate } = await import('drizzle-orm/pglite/migrator');
        const client = new PGlite(process.env.PGLITE_DIR || '.pglite');
        await migrate(drizzle(client), { migrationsFolder: './drizzle' });
        await client.close();
        console.log('✓ Lokal PGlite bazasiga migratsiyalar qo‘llandi (.pglite/)');
    }
}

main().catch(e => { console.error(e); process.exit(1); });
