'use server';

import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/db';
import { exercises, glossary, groups, lessons, questions, sessions, simulators, tools, users, type ExerciseData, type SimCriterion, type SimStudent } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

async function admin() {
    const u = await getCurrentUser();
    if (!u || u.role !== 'admin') redirect('/dashboard');
    return u;
}
const s = (v: unknown, max = 500) => String(v ?? '').trim().slice(0, max);
const n = (v: unknown, def = 0, min = 0, max = 10000) => { const x = Math.round(Number(v)); return Number.isFinite(x) ? Math.max(min, Math.min(max, x)) : def; };
const list = (v: unknown, max = 500) => (Array.isArray(v) ? v.map(x => s(x, max)).filter(Boolean) : []);
const url = (v: unknown) => { const x = s(v, 1000); return x && /^https?:\/\//i.test(x) ? x : null; };
const icon = (v: unknown, def: string) => { const x = s(v, 60); return /^fa-[a-z0-9-]+$/.test(x) ? x : def; };
const level = (v: unknown) => (['easy', 'medium', 'hard'].includes(String(v)) ? String(v) as 'easy' | 'medium' | 'hard' : 'medium');
type R = { ok?: boolean; error?: string; id?: number };

/* ---------------- Foydalanuvchilar ---------------- */
export async function setUserRoleAction(userId: number, role: string): Promise<R> {
    const me = await admin();
    if (!['student', 'teacher', 'admin'].includes(role)) return { error: 'Noto‘g‘ri rol' };
    if (userId === me.id && role !== 'admin') return { error: 'O‘zingizdan admin huquqini olib bo‘lmaydi.' };
    const db = await getDb();
    await db.update(users).set({ role: role as 'student' | 'teacher' | 'admin' }).where(eq(users.id, userId));
    revalidatePath('/admin/users');
    return { ok: true };
}

export async function setUserGroupAction(userId: number, groupId: number | null): Promise<R> {
    await admin();
    const db = await getDb();
    if (groupId) {
        const [g] = await db.select({ id: groups.id }).from(groups).where(eq(groups.id, groupId));
        if (!g) return { error: 'Guruh topilmadi' };
    }
    await db.update(users).set({ groupId: groupId || null }).where(eq(users.id, userId));
    revalidatePath('/admin/users');
    return { ok: true };
}

export async function resetUserPasswordAction(userId: number): Promise<{ password?: string; error?: string }> {
    await admin();
    const A = 'abcdefghjkmnpqrstuvwxyz23456789';
    const password = Array.from({ length: 10 }, () => A[randomInt(A.length)]).join('');
    const db = await getDb();
    await db.update(users).set({ passwordHash: await bcrypt.hash(password, 10) }).where(eq(users.id, userId));
    await db.delete(sessions).where(eq(sessions.userId, userId));
    return { password };
}

export async function deleteUserAction(userId: number): Promise<R> {
    const me = await admin();
    if (userId === me.id) return { error: 'O‘zingizni o‘chira olmaysiz.' };
    const db = await getDb();
    await db.update(groups).set({ teacherId: null }).where(eq(groups.teacherId, userId));
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath('/admin/users');
    return { ok: true };
}

/* ---------------- Darslar ---------------- */
export type LessonInput = {
    title: string; chapter: string; summary: string; icon: string; duration: number; position: number; published: boolean;
    goals: string[]; terms: string[]; reviewQuestions: string[]; content: string; videoUrl: string; pdfUrl: string;
};

export async function saveLessonAction(id: number | null, d: LessonInput): Promise<R> {
    await admin();
    const v = {
        title: s(d.title, 200), chapter: s(d.chapter, 40) || 'I bob', summary: s(d.summary, 600), icon: icon(d.icon, 'fa-book-open'),
        duration: n(d.duration, 20, 1, 600), position: n(d.position, 0), published: !!d.published,
        goals: list(d.goals), terms: list(d.terms, 100), reviewQuestions: list(d.reviewQuestions), content: s(d.content, 200000),
        videoUrl: url(d.videoUrl), pdfUrl: url(d.pdfUrl), updatedAt: new Date()
    };
    if (v.title.length < 3) return { error: 'Dars nomini kiriting.' };
    if (s(d.videoUrl) && !v.videoUrl) return { error: 'Video havolasi http:// yoki https:// bilan boshlanishi kerak.' };
    if (s(d.pdfUrl) && !v.pdfUrl) return { error: 'PDF havolasi http:// yoki https:// bilan boshlanishi kerak.' };
    const db = await getDb();
    if (id) await db.update(lessons).set(v).where(eq(lessons.id, id));
    else id = (await db.insert(lessons).values(v).returning({ id: lessons.id }))[0].id;
    revalidatePath('/admin/lessons'); revalidatePath('/lessons');
    return { ok: true, id };
}

export async function deleteLessonAction(id: number): Promise<R> {
    await admin();
    const db = await getDb();
    await db.delete(lessons).where(eq(lessons.id, id));
    revalidatePath('/admin/lessons'); revalidatePath('/lessons');
    return { ok: true };
}

export type QuestionInput = { text: string; options: string[]; correct: number; explanation: string };

export async function saveQuestionsAction(lessonId: number, qs: QuestionInput[]): Promise<R> {
    await admin();
    if (!Array.isArray(qs)) return { error: 'Noto‘g‘ri ma’lumot' };
    const rows = [];
    for (const [i, q] of qs.entries()) {
        const options = list(q.options);
        const text = s(q.text, 1000);
        if (!text) return { error: `${i + 1}-savol matni bo‘sh.` };
        if (options.length < 2) return { error: `${i + 1}-savolda kamida 2 ta variant bo‘lsin.` };
        const correct = n(q.correct, 0, 0, options.length - 1);
        rows.push({ lessonId, position: i + 1, text, options, correct, explanation: s(q.explanation, 1500) });
    }
    const db = await getDb();
    await db.delete(questions).where(eq(questions.lessonId, lessonId));
    if (rows.length) await db.insert(questions).values(rows);
    revalidatePath(`/admin/lessons/${lessonId}`);
    return { ok: true };
}

/* ---------------- Mashqlar ---------------- */
export type ExerciseInput = {
    type: 'classify' | 'match' | 'order' | 'choice' | 'feedback'; title: string; summary: string; task: string; icon: string;
    level: string; duration: number; position: number; lessonId: number | null; published: boolean; data: ExerciseData;
};

function cleanExerciseData(type: ExerciseInput['type'], d: Record<string, unknown>): ExerciseData | string {
    switch (type) {
        case 'classify': {
            const categories = list(d.categories, 100);
            const items = (Array.isArray(d.items) ? d.items : []).map((x: { t?: unknown; c?: unknown }) => ({ t: s(x?.t), c: n(x?.c, 0, 0, Math.max(0, categories.length - 1)) })).filter(x => x.t);
            if (categories.length < 2) return 'Kamida 2 ta toifa kiriting.';
            if (items.length < 2) return 'Kamida 2 ta band kiriting.';
            return { categories, items };
        }
        case 'match': {
            const pairs = (Array.isArray(d.pairs) ? d.pairs : []).map((x: { l?: unknown; r?: unknown }) => ({ l: s(x?.l, 200), r: s(x?.r) })).filter(x => x.l && x.r);
            return pairs.length < 2 ? 'Kamida 2 ta juft kiriting.' : { pairs };
        }
        case 'order': {
            const items = list(d.items);
            return items.length < 2 ? 'Kamida 2 ta bosqich kiriting.' : { items };
        }
        case 'choice': {
            const cases = (Array.isArray(d.cases) ? d.cases : []).map((x: { t?: unknown; o?: unknown; a?: unknown; e?: unknown }) => {
                const o = list(x?.o);
                return { t: s(x?.t, 1500), o, a: n(x?.a, 0, 0, Math.max(0, o.length - 1)), e: s(x?.e, 1500) };
            }).filter(x => x.t && x.o.length >= 2);
            return cases.length < 1 ? 'Kamida 1 ta vaziyat (2+ variant bilan) kiriting.' : { cases };
        }
        case 'feedback': {
            const v = { work: s(d.work, 5000), rubric: list(d.rubric), checklist: list(d.checklist), praise: list(d.praise, 60), next: list(d.next, 60), model: s(d.model, 5000) };
            if (!v.work) return 'O‘quvchi ishini kiriting.';
            if (!v.checklist.length) return 'Kamida 1 ta o‘z-o‘zini tekshirish bandini kiriting.';
            return v;
        }
    }
}

export async function saveExerciseAction(id: number | null, d: ExerciseInput): Promise<R> {
    await admin();
    if (!['classify', 'match', 'order', 'choice', 'feedback'].includes(d.type)) return { error: 'Noto‘g‘ri mashq turi' };
    const data = cleanExerciseData(d.type, (d.data || {}) as Record<string, unknown>);
    if (typeof data === 'string') return { error: data };
    const v = {
        type: d.type, title: s(d.title, 200), summary: s(d.summary, 600), task: s(d.task, 2000), icon: icon(d.icon, 'fa-puzzle-piece'),
        level: level(d.level), duration: n(d.duration, 10, 1, 300), position: n(d.position, 0), lessonId: d.lessonId ? n(d.lessonId) : null, published: !!d.published, data
    };
    if (v.title.length < 3) return { error: 'Mashq nomini kiriting.' };
    const db = await getDb();
    if (id) await db.update(exercises).set(v).where(eq(exercises.id, id));
    else id = (await db.insert(exercises).values(v).returning({ id: exercises.id }))[0].id;
    revalidatePath('/admin/exercises'); revalidatePath('/exercises');
    return { ok: true, id };
}

export async function deleteExerciseAction(id: number): Promise<R> {
    await admin();
    const db = await getDb();
    await db.delete(exercises).where(eq(exercises.id, id));
    revalidatePath('/admin/exercises');
    return { ok: true };
}

/* ---------------- Simulyatorlar ---------------- */
export type SimulatorInput = {
    subject: string; grade: string; icon: string; level: string; title: string; summary: string; task: string;
    position: number; published: boolean; criteria: SimCriterion[]; students: SimStudent[];
};

export async function saveSimulatorAction(id: number | null, d: SimulatorInput): Promise<R> {
    await admin();
    const criteria = (Array.isArray(d.criteria) ? d.criteria : []).map(c => ({ n: s(c?.n, 200), d: [s(c?.d?.[0]), s(c?.d?.[1]), s(c?.d?.[2])] as [string, string, string] })).filter(c => c.n);
    if (!criteria.length) return { error: 'Kamida 1 ta mezon kiriting.' };
    const students = (Array.isArray(d.students) ? d.students : []).map(x => ({
        name: s(x?.name, 60), color: /^#[0-9a-f]{6}$/i.test(String(x?.color)) ? String(x.color) : '#0055c6', work: s(x?.work, 5000),
        expert: criteria.map((_, i) => n(x?.expert?.[i], 2, 1, 3)), fb: s(x?.fb, 2000)
    })).filter(x => x.name && x.work);
    if (!students.length) return { error: 'Kamida 1 ta o‘quvchi (ismi va ishi bilan) kiriting.' };
    const v = {
        subject: s(d.subject, 80) || 'Fan', grade: s(d.grade, 30) || '1-sinf', icon: icon(d.icon, 'fa-children'), level: level(d.level),
        title: s(d.title, 200), summary: s(d.summary, 600), task: s(d.task, 5000), position: n(d.position, 0), published: !!d.published, criteria, students
    };
    if (v.title.length < 3) return { error: 'Simulyator nomini kiriting.' };
    if (!v.task) return { error: 'Topshiriq matnini kiriting.' };
    const db = await getDb();
    if (id) await db.update(simulators).set(v).where(eq(simulators.id, id));
    else id = (await db.insert(simulators).values(v).returning({ id: simulators.id }))[0].id;
    revalidatePath('/admin/simulators'); revalidatePath('/simulators');
    return { ok: true, id };
}

export async function deleteSimulatorAction(id: number): Promise<R> {
    await admin();
    const db = await getDb();
    await db.delete(simulators).where(eq(simulators.id, id));
    revalidatePath('/admin/simulators');
    return { ok: true };
}

/* ---------------- Vositalar va glossariy ---------------- */
export type ToolInput = { name: string; category: string; icon: string; url: string; use: string; tip: string; kinds: string[]; position: number };

export async function saveToolAction(id: number | null, d: ToolInput): Promise<R> {
    await admin();
    const v = { name: s(d.name, 80), category: s(d.category, 60), icon: icon(d.icon, 'fa-laptop'), url: url(d.url) || '', use: s(d.use, 600), tip: s(d.tip, 600), kinds: list(d.kinds, 30), position: n(d.position, 0) };
    if (!v.name || !v.category || !v.use) return { error: 'Nomi, turi va qo‘llanilishi majburiy.' };
    if (!v.url) return { error: 'Sayt manzili https:// bilan boshlanishi kerak.' };
    const db = await getDb();
    if (id) await db.update(tools).set(v).where(eq(tools.id, id));
    else id = (await db.insert(tools).values(v).returning({ id: tools.id }))[0].id;
    revalidatePath('/admin/tools'); revalidatePath('/tools');
    return { ok: true, id };
}

export async function deleteToolAction(id: number): Promise<R> {
    await admin();
    const db = await getDb();
    await db.delete(tools).where(eq(tools.id, id));
    revalidatePath('/admin/tools'); revalidatePath('/tools');
    return { ok: true };
}

export async function saveTermAction(id: number | null, term: string, definition: string): Promise<R> {
    await admin();
    const t = s(term, 120), d = s(definition, 1500);
    if (!t || !d) return { error: 'Atama va izohni kiriting.' };
    const db = await getDb();
    try {
        if (id) await db.update(glossary).set({ term: t, definition: d }).where(eq(glossary.id, id));
        else id = (await db.insert(glossary).values({ term: t, definition: d }).returning({ id: glossary.id }))[0].id;
    } catch { return { error: 'Bunday atama allaqachon mavjud.' }; }
    revalidatePath('/admin/glossary'); revalidatePath('/resources');
    return { ok: true, id };
}

export async function deleteTermAction(id: number): Promise<R> {
    await admin();
    const db = await getDb();
    await db.delete(glossary).where(eq(glossary.id, id));
    revalidatePath('/admin/glossary'); revalidatePath('/resources');
    return { ok: true };
}
