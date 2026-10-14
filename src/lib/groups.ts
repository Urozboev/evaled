import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { groups } from '@/db/schema';
import type { SessionUser } from './auth';

/** O‘qituvchi faqat o‘z guruhini, admin esa barchasini boshqaradi. */
export async function manageableGroup(u: SessionUser, groupId: number) {
    if (u.role !== 'teacher' && u.role !== 'admin') return null;
    const db = await getDb();
    const [g] = await db.select().from(groups).where(eq(groups.id, groupId));
    if (!g || (u.role !== 'admin' && g.teacherId !== u.id)) return null;
    return g;
}
