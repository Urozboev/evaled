import { createHash, randomBytes } from 'node:crypto';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq, gt, lt } from 'drizzle-orm';
import { getDb } from '@/db';
import { sessions, users, type User } from '@/db/schema';

const COOKIE = 'rbk_session';
const SESSION_DAYS = 30;

export const hashToken = (t: string) => createHash('sha256').update(t).digest('hex');
export const newToken = () => randomBytes(32).toString('base64url');

export type SessionUser = Pick<User, 'id' | 'email' | 'fullName' | 'role' | 'groupId'>;

export async function createSession(userId: number) {
    const db = await getDb();
    const token = newToken();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
    await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
    // Eskirgan sessiyalarni tozalash
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
    (await cookies()).set(COOKIE, token, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expiresAt
    });
}

export async function destroySession() {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (token) {
        const db = await getDb();
        await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
    }
    jar.delete(COOKIE);
}

/** Joriy foydalanuvchi (so‘rov davomida keshlanadi). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const db = await getDb();
    const rows = await db
        .select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role, groupId: users.groupId, lastSeenAt: users.lastSeenAt })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())));
    const u = rows[0];
    if (!u) return null;
    if (!u.lastSeenAt || Date.now() - u.lastSeenAt.getTime() > 3600e3) {
        await db.update(users).set({ lastSeenAt: new Date() }).where(eq(users.id, u.id));
    }
    const { lastSeenAt: _, ...user } = u;
    return user;
});

async function currentPath() {
    const h = await headers();
    return h.get('x-pathname') || '/dashboard';
}

export async function requireUser(next?: string): Promise<SessionUser> {
    const u = await getCurrentUser();
    if (!u) redirect(`/login?next=${encodeURIComponent(next || await currentPath())}`);
    return u;
}

export async function requireRole(roles: SessionUser['role'][], next?: string): Promise<SessionUser> {
    const u = await requireUser(next);
    if (!roles.includes(u.role)) redirect('/dashboard');
    return u;
}

export function isStaff(u: SessionUser | null) {
    return !!u && (u.role === 'teacher' || u.role === 'admin');
}
