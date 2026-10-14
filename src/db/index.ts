import { createDb } from './client';

/**
 * Ilova bo‘ylab yagona DB ulanishi.
 * DATABASE_URL berilsa — Neon (HTTP), aks holda lokal PGlite (.pglite/).
 */
const g = globalThis as unknown as { __db?: Awaited<ReturnType<typeof createDb>> };

export async function getDb() {
    if (!g.__db) g.__db = await createDb();
    return g.__db;
}
