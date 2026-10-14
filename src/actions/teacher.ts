'use server';

import { randomInt } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/db';
import { groups, users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { manageableGroup } from '@/lib/groups';

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // chalkashtiradigan belgilarsiz (0/O, 1/I)

async function staff() {
    const u = await getCurrentUser();
    if (!u || (u.role !== 'teacher' && u.role !== 'admin')) redirect('/dashboard');
    return u;
}

export async function createGroupAction(_: unknown, fd: FormData) {
    const u = await staff();
    const name = String(fd.get('name') ?? '').trim().replace(/\s+/g, ' ');
    if (name.length < 2) return { error: 'Guruh nomini kiriting (masalan: BT-21-1).' };
    const db = await getDb();
    for (let k = 0; k < 10; k++) {
        const code = Array.from({ length: 6 }, () => ALPHA[randomInt(ALPHA.length)]).join('');
        const exists = await db.select({ id: groups.id }).from(groups).where(eq(groups.code, code));
        if (exists.length) continue;
        await db.insert(groups).values({ name: name.slice(0, 80), code, teacherId: u.id });
        revalidatePath('/teacher');
        return { ok: `“${name}” guruhi yaratildi. Kod: ${code}` };
    }
    return { error: 'Kod yaratib bo‘lmadi, qayta urinib ko‘ring.' };
}

export async function renameGroupAction(groupId: number, name: string) {
    const g = await manageableGroup(await staff(), groupId);
    if (!g) throw new Error('Ruxsat yo‘q');
    const n = String(name).trim().replace(/\s+/g, ' ').slice(0, 80);
    if (n.length < 2) return { error: 'Nom juda qisqa' };
    const db = await getDb();
    await db.update(groups).set({ name: n }).where(eq(groups.id, groupId));
    revalidatePath('/teacher');
    return { ok: true };
}

export async function deleteGroupAction(groupId: number) {
    const g = await manageableGroup(await staff(), groupId);
    if (!g) throw new Error('Ruxsat yo‘q');
    const db = await getDb();
    await db.update(users).set({ groupId: null }).where(eq(users.groupId, groupId));
    await db.delete(groups).where(eq(groups.id, groupId));
    revalidatePath('/teacher');
    redirect('/teacher');
}

export async function removeStudentAction(groupId: number, userId: number) {
    const g = await manageableGroup(await staff(), groupId);
    if (!g) throw new Error('Ruxsat yo‘q');
    const db = await getDb();
    await db.update(users).set({ groupId: null }).where(and(eq(users.id, userId), eq(users.groupId, groupId)));
    revalidatePath(`/teacher/groups/${groupId}`);
    return { ok: true };
}
