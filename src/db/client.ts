import * as schema from './schema';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export async function createDb(): Promise<Db> {
    const url = process.env.DATABASE_URL;
    if (url) {
        const { neon } = await import('@neondatabase/serverless');
        const { drizzle } = await import('drizzle-orm/neon-http');
        return drizzle(neon(url), { schema }) as unknown as Db;
    }
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_PGLITE) {
        throw new Error('DATABASE_URL o‘rnatilmagan. Neon ulanish manzilini muhit o‘zgaruvchisiga qo‘shing.');
    }
    const { PGlite } = await import('@electric-sql/pglite');
    const { drizzle } = await import('drizzle-orm/pglite');
    const client = new PGlite(process.env.PGLITE_DIR || '.pglite');
    return drizzle(client, { schema }) as unknown as Db;
}
