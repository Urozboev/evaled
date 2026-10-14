'use server';

import bcrypt from 'bcryptjs';
import { and, eq, gt } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/db';
import { groups, passwordResets, sessions, users } from '@/db/schema';
import { createSession, destroySession, getCurrentUser, hashToken, newToken } from '@/lib/auth';

export type FormState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);
const safeNext = (n: string) => (n.startsWith('/') && !n.startsWith('//') ? n : '/dashboard');

async function findGroup(code: string) {
    const db = await getDb();
    const r = await db.select({ id: groups.id, name: groups.name }).from(groups).where(eq(groups.code, code.toUpperCase()));
    return r[0];
}

export async function registerAction(_: FormState, fd: FormData): Promise<FormState> {
    const fullName = str(fd, 'fullName').replace(/\s+/g, ' ');
    const email = str(fd, 'email').toLowerCase();
    const password = String(fd.get('password') ?? '');
    const code = str(fd, 'groupCode').toUpperCase();
    const values = { fullName, email, groupCode: code };
    if (fullName.length < 5 || !fullName.includes(' ')) return { error: 'Familiya va ismingizni to‘liq kiriting (masalan: Aliyeva Madina).', values };
    if (!EMAIL_RE.test(email)) return { error: 'E-pochta manzili noto‘g‘ri.', values };
    if (password.length < 8) return { error: 'Parol kamida 8 belgidan iborat bo‘lsin.', values };
    if (password !== String(fd.get('password2') ?? '')) return { error: 'Parollar bir xil emas.', values };

    const db = await getDb();
    let groupId: number | null = null;
    if (code) {
        const g = await findGroup(code);
        if (!g) return { error: 'Bunday guruh kodi topilmadi. Kodni o‘qituvchingizdan tekshiring yoki bo‘sh qoldiring.', values };
        groupId = g.id;
    }
    const exists = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    if (exists.length) return { error: 'Bu e-pochta bilan akkaunt allaqachon mavjud. “Kirish” sahifasidan foydalaning.', values };

    const [u] = await db.insert(users).values({ email, fullName, passwordHash: await bcrypt.hash(password, 10), groupId }).returning({ id: users.id });
    await createSession(u.id);
    redirect('/dashboard?welcome=1');
}

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
    const email = str(fd, 'email').toLowerCase();
    const password = String(fd.get('password') ?? '');
    const next = safeNext(str(fd, 'next'));
    if (!email || !password) return { error: 'E-pochta va parolni kiriting.', values: { email } };
    const db = await getDb();
    const [u] = await db.select({ id: users.id, hash: users.passwordHash }).from(users).where(eq(users.email, email));
    const ok = await bcrypt.compare(password, u ? u.hash : DUMMY_HASH); // vaqt bo‘yicha farq bo‘lmasligi uchun
    if (!u || !ok) return { error: 'E-pochta yoki parol noto‘g‘ri.', values: { email } };
    await createSession(u.id);
    redirect(next);
}

export async function logoutAction() {
    await destroySession();
    redirect('/');
}

async function sendMail(to: string, subject: string, html: string) {
    const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM;
    if (!key || !from) return false;
    const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, html })
    });
    return r.ok;
}

export async function requestResetAction(_: FormState, fd: FormData): Promise<FormState> {
    const email = str(fd, 'email').toLowerCase();
    if (!EMAIL_RE.test(email)) return { error: 'E-pochta manzili noto‘g‘ri.', values: { email } };
    if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
        return { error: 'Xat yuborish xizmati hali sozlanmagan. Parolni tiklash uchun o‘qituvchingiz yoki administratorga murojaat qiling — ular yangi vaqtinchalik parol o‘rnatib beradi.', values: { email } };
    }
    const db = await getDb();
    const [u] = await db.select({ id: users.id, name: users.fullName }).from(users).where(eq(users.email, email));
    if (u) {
        const token = newToken();
        await db.delete(passwordResets).where(eq(passwordResets.userId, u.id));
        await db.insert(passwordResets).values({ id: hashToken(token), userId: u.id, expiresAt: new Date(Date.now() + 3600e3) });
        const link = `${process.env.APP_URL || ''}/reset-password?token=${token}`;
        await sendMail(email, 'Parolni tiklash', `<p>Assalomu alaykum, ${u.name}!</p><p>Parolni tiklash uchun havola (1 soat amal qiladi):</p><p><a href="${link}">${link}</a></p><p>Agar siz so‘ramagan bo‘lsangiz, bu xatga e’tibor bermang.</p>`);
    }
    return { ok: 'Agar bu e-pochta ro‘yxatdan o‘tgan bo‘lsa, unga parolni tiklash havolasi yuborildi. Pochtangizni (va “Spam” papkasini) tekshiring.' };
}

export async function resetPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
    const token = str(fd, 'token');
    const password = String(fd.get('password') ?? '');
    if (password.length < 8) return { error: 'Parol kamida 8 belgidan iborat bo‘lsin.' };
    if (password !== String(fd.get('password2') ?? '')) return { error: 'Parollar bir xil emas.' };
    const db = await getDb();
    const [r] = await db.select().from(passwordResets).where(and(eq(passwordResets.id, hashToken(token)), gt(passwordResets.expiresAt, new Date())));
    if (!r) return { error: 'Havola eskirgan yoki noto‘g‘ri. Qaytadan so‘rov yuboring.' };
    await db.update(users).set({ passwordHash: await bcrypt.hash(password, 10) }).where(eq(users.id, r.userId));
    await db.delete(passwordResets).where(eq(passwordResets.userId, r.userId));
    await db.delete(sessions).where(eq(sessions.userId, r.userId));
    await createSession(r.userId);
    redirect('/dashboard');
}

/* ---------------- Profil ---------------- */
export async function updateProfileAction(_: FormState, fd: FormData): Promise<FormState> {
    const me = await getCurrentUser();
    if (!me) redirect('/login');
    const fullName = str(fd, 'fullName').replace(/\s+/g, ' ');
    if (fullName.length < 5 || !fullName.includes(' ')) return { error: 'Familiya va ismingizni to‘liq kiriting.' };
    const db = await getDb();
    await db.update(users).set({ fullName }).where(eq(users.id, me.id));
    revalidatePath('/', 'layout');
    return { ok: 'Ma’lumotlar saqlandi.' };
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
    const me = await getCurrentUser();
    if (!me) redirect('/login');
    const cur = String(fd.get('current') ?? ''), next = String(fd.get('password') ?? '');
    if (next.length < 8) return { error: 'Yangi parol kamida 8 belgidan iborat bo‘lsin.' };
    if (next !== String(fd.get('password2') ?? '')) return { error: 'Yangi parollar bir xil emas.' };
    const db = await getDb();
    const [u] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, me.id));
    if (!(await bcrypt.compare(cur, u.hash))) return { error: 'Joriy parol noto‘g‘ri.' };
    await db.update(users).set({ passwordHash: await bcrypt.hash(next, 10) }).where(eq(users.id, me.id));
    return { ok: 'Parol o‘zgartirildi.' };
}

export async function joinGroupAction(_: FormState, fd: FormData): Promise<FormState> {
    const me = await getCurrentUser();
    if (!me) redirect('/login');
    const code = str(fd, 'groupCode');
    const db = await getDb();
    if (!code) {
        await db.update(users).set({ groupId: null }).where(eq(users.id, me.id));
        revalidatePath('/profile');
        return { ok: 'Siz guruhdan chiqdingiz.' };
    }
    const g = await findGroup(code);
    if (!g) return { error: 'Bunday guruh kodi topilmadi.' };
    await db.update(users).set({ groupId: g.id }).where(eq(users.id, me.id));
    revalidatePath('/profile');
    return { ok: `Siz “${g.name}” guruhiga qo‘shildingiz.` };
}
