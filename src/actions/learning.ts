'use server';

import { randomInt } from 'node:crypto';
import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/db';
import { certificates, diagnostics, exerciseAttempts, exercises, lessonCompletions, questions, simulatorAttempts, simulators, testAttempts, users, type DiagResult } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { DIAGNOSTIC } from '@/lib/content';
import { gradeExercise, gradeSimulator, type ExercisePayload } from '@/lib/grading';
import { getProgress } from '@/lib/progress';

async function me() {
    const u = await getCurrentUser();
    if (!u) redirect('/login');
    return u;
}

export async function setLessonDoneAction(lessonId: number, done: boolean) {
    const u = await me();
    const db = await getDb();
    if (done) await db.insert(lessonCompletions).values({ userId: u.id, lessonId }).onConflictDoNothing();
    else await db.delete(lessonCompletions).where(and(eq(lessonCompletions.userId, u.id), eq(lessonCompletions.lessonId, lessonId)));
    revalidatePath('/lessons');
    revalidatePath('/dashboard');
    return { done };
}

export type TestReview = {
    score: number; correct: number; total: number;
    items: { id: number; text: string; options: string[]; correct: number; answer: number | null; explanation: string }[];
};

/** answers — har bir savol uchun asl (aralashtirilmagan) variant indeksi yoki null. */
export async function submitTestAction(testKey: string, questionIds: number[], answers: (number | null)[]): Promise<TestReview> {
    const u = await me();
    if (!/^(lesson:\d+|final)$/.test(testKey) || !Array.isArray(questionIds) || questionIds.length === 0 || questionIds.length > 60) throw new Error('Noto‘g‘ri so‘rov');
    const db = await getDb();
    const rows = await db.select().from(questions).where(inArray(questions.id, questionIds));
    const byId = new Map(rows.map(r => [r.id, r]));
    if (testKey.startsWith('lesson:')) {
        const lid = Number(testKey.slice(7));
        if (rows.some(r => r.lessonId !== lid)) throw new Error('Noto‘g‘ri so‘rov');
    }
    const items = questionIds.map((id, i) => {
        const q = byId.get(id);
        if (!q) return null;
        const a = answers[i];
        return { id, text: q.text, options: q.options, correct: q.correct, answer: typeof a === 'number' ? a : null, explanation: q.explanation };
    }).filter((x): x is NonNullable<typeof x> => !!x);
    const correct = items.filter(it => it.answer === it.correct).length;
    const score = items.length ? Math.round(correct / items.length * 100) : 0;
    await db.insert(testAttempts).values({ userId: u.id, testKey, score, correct, total: items.length });
    revalidatePath('/tests');
    revalidatePath('/dashboard');
    return { score, correct, total: items.length, items };
}

export async function submitExerciseAction(exerciseId: number, payload: ExercisePayload) {
    const u = await me();
    const db = await getDb();
    const [ex] = await db.select().from(exercises).where(eq(exercises.id, exerciseId));
    if (!ex || ex.type !== payload.type) throw new Error('Mashq topilmadi');
    if (payload.type === 'feedback') payload = { ...payload, text: String(payload.text).slice(0, 5000) };
    const r = gradeExercise(ex.data, payload);
    await db.insert(exerciseAttempts).values({ userId: u.id, exerciseId, score: r.score, payload });
    revalidatePath('/exercises');
    revalidatePath('/dashboard');
    return r;
}

export async function submitSimulatorAction(simulatorId: number, grades: number[][], feedback: string[]) {
    const u = await me();
    const db = await getDb();
    const [sim] = await db.select().from(simulators).where(eq(simulators.id, simulatorId));
    if (!sim) throw new Error('Simulyator topilmadi');
    const clean = sim.students.map((_, i) => sim.criteria.map((__, c) => Math.max(0, Math.min(3, Math.round(Number(grades?.[i]?.[c]) || 0)))));
    const r = gradeSimulator(sim.students, clean);
    await db.insert(simulatorAttempts).values({ userId: u.id, simulatorId, score: r.score, payload: { grades: clean, feedback: (feedback || []).map(f => String(f).slice(0, 2000)) } });
    revalidatePath('/simulators');
    revalidatePath('/dashboard');
    return r;
}

export async function saveDiagnosticAction(stage: 'pre' | 'post', values: number[]) {
    const u = await me();
    if (stage !== 'pre' && stage !== 'post') throw new Error('Noto‘g‘ri bosqich');
    const items = DIAGNOSTIC.items;
    if (!Array.isArray(values) || values.length !== items.length || values.some(v => !Number.isInteger(v) || v < 1 || v > 5)) throw new Error('Barcha mulohazalarga javob bering');
    const res = {} as DiagResult;
    (['mot', 'cog', 'met', 'ref'] as const).forEach(c => {
        const idx = items.map((it, i) => (it.c === c ? i : -1)).filter(i => i >= 0);
        const avg = idx.reduce((a, i) => a + values[i], 0) / idx.length;
        res[c] = Math.round((avg - 1) / 4 * 100);
    });
    res.total = Math.round((res.mot + res.cog + res.met + res.ref) / 4);
    const db = await getDb();
    await db.insert(diagnostics).values({ userId: u.id, stage, values, result: res })
        .onConflictDoUpdate({ target: [diagnostics.userId, diagnostics.stage], set: { values, result: res, createdAt: new Date() } });
    revalidatePath('/diagnostics');
    revalidatePath('/dashboard');
    return res;
}

export async function issueCertificateAction(fullName: string) {
    const u = await me();
    const name = String(fullName || '').trim().replace(/\s+/g, ' ');
    if (name.length < 5) return { error: 'Familiya va ismingizni to‘liq kiriting.' };
    const p = await getProgress(u.id);
    if (!p.eligible) return { error: 'Sertifikat talablari hali to‘liq bajarilmagan.' };
    const db = await getDb();
    if (name !== u.fullName) await db.update(users).set({ fullName: name }).where(eq(users.id, u.id));
    const [existing] = await db.select().from(certificates).where(eq(certificates.userId, u.id));
    if (existing) {
        await db.update(certificates).set({ fullName: name, finalScore: p.finalBest, overall: p.overall }).where(eq(certificates.userId, u.id));
    } else {
        const number = `RBK-${new Date().getFullYear()}-${String(randomInt(0, 1e6)).padStart(6, '0')}`;
        await db.insert(certificates).values({ userId: u.id, number, fullName: name, finalScore: p.finalBest, overall: p.overall });
    }
    revalidatePath('/certificate');
    return { ok: true };
}
