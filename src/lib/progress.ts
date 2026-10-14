import { and, asc, eq, inArray, max, count, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import { certificates, diagnostics, exerciseAttempts, exercises, lessonCompletions, lessons, simulatorAttempts, simulators, testAttempts, type DiagResult } from '@/db/schema';
import { PASS_SCORE, REQ_EXERCISES, REQ_SIMULATORS } from './content';


/** Kontent ro‘yxati (faqat e’lon qilinganlar). */
export async function catalog() {
    const db = await getDb();
    const [L, E, S] = await Promise.all([
        db.select({ id: lessons.id, title: lessons.title, icon: lessons.icon, chapter: lessons.chapter }).from(lessons).where(eq(lessons.published, true)).orderBy(asc(lessons.position), asc(lessons.id)),
        db.select({ id: exercises.id, title: exercises.title }).from(exercises).where(eq(exercises.published, true)).orderBy(asc(exercises.position), asc(exercises.id)),
        db.select({ id: simulators.id, title: simulators.title, subject: simulators.subject }).from(simulators).where(eq(simulators.published, true)).orderBy(asc(simulators.position), asc(simulators.id))
    ]);
    return { lessons: L, exercises: E, simulators: S };
}

export async function progressForUsers(userIds: number[]) {
    const db = await getDb();
    const cat = await catalog();
    const out = new Map<number, ReturnType<typeof build>>();
    if (!userIds.length) return out;

    const [lc, ta, ea, sa, dg, cert, last] = await Promise.all([
        db.select({ userId: lessonCompletions.userId, lessonId: lessonCompletions.lessonId }).from(lessonCompletions).where(inArray(lessonCompletions.userId, userIds)),
        db.select({ userId: testAttempts.userId, key: testAttempts.testKey, best: max(testAttempts.score), tries: count() }).from(testAttempts).where(inArray(testAttempts.userId, userIds)).groupBy(testAttempts.userId, testAttempts.testKey),
        db.select({ userId: exerciseAttempts.userId, id: exerciseAttempts.exerciseId, best: max(exerciseAttempts.score) }).from(exerciseAttempts).where(inArray(exerciseAttempts.userId, userIds)).groupBy(exerciseAttempts.userId, exerciseAttempts.exerciseId),
        db.select({ userId: simulatorAttempts.userId, id: simulatorAttempts.simulatorId, best: max(simulatorAttempts.score) }).from(simulatorAttempts).where(inArray(simulatorAttempts.userId, userIds)).groupBy(simulatorAttempts.userId, simulatorAttempts.simulatorId),
        db.select({ userId: diagnostics.userId, stage: diagnostics.stage, result: diagnostics.result, values: diagnostics.values, at: diagnostics.createdAt }).from(diagnostics).where(inArray(diagnostics.userId, userIds)),
        db.select({ userId: certificates.userId, number: certificates.number, issuedAt: certificates.issuedAt }).from(certificates).where(inArray(certificates.userId, userIds)),
        db.select({ userId: testAttempts.userId, at: sql<Date>`max(${testAttempts.createdAt})` }).from(testAttempts).where(inArray(testAttempts.userId, userIds)).groupBy(testAttempts.userId)
    ]);

    function build(uid: number) {
        const done = new Set(lc.filter(r => r.userId === uid).map(r => r.lessonId));
        const tests: Record<string, { best: number; tries: number }> = {};
        ta.filter(r => r.userId === uid).forEach(r => { tests[r.key] = { best: Number(r.best) || 0, tries: Number(r.tries) }; });
        const ex: Record<number, number> = {};
        ea.filter(r => r.userId === uid).forEach(r => { ex[r.id] = Number(r.best) || 0; });
        const sims: Record<number, number> = {};
        sa.filter(r => r.userId === uid).forEach(r => { sims[r.id] = Number(r.best) || 0; });
        const diag: Partial<Record<'pre' | 'post', { result: DiagResult; values: number[]; at: Date }>> = {};
        dg.filter(r => r.userId === uid).forEach(r => { diag[r.stage] = { result: r.result, values: r.values, at: new Date(r.at) }; });

        const L = cat.lessons, E = cat.exercises, S = cat.simulators;
        const lessonsDone = L.filter(l => done.has(l.id)).length;
        const testKeys = [...L.map(l => `lesson:${l.id}`), 'final'];
        const avg = (vals: number[], n: number) => (n ? vals.reduce((a, b) => a + b, 0) / n : 0);
        const testsAvg = avg(testKeys.map(k => tests[k]?.best || 0), testKeys.length);
        const exAvg = avg(E.map(e => ex[e.id] || 0), E.length);
        const simAvg = avg(S.map(x => sims[x.id] || 0), S.length);
        const overall = Math.round((L.length ? lessonsDone / L.length : 0) * 30 + testsAvg * .3 + exAvg * .2 + simAvg * .2);
        const exDone = E.filter(e => e.id in ex).length;
        const simDone = S.filter(x => x.id in sims).length;
        const finalBest = tests.final?.best || 0;
        const reqEx = Math.min(REQ_EXERCISES, E.length), reqSim = Math.min(REQ_SIMULATORS, S.length);
        const req = { lessons: lessonsDone === L.length && L.length > 0, final: finalBest >= PASS_SCORE, exercises: exDone >= reqEx, sims: simDone >= reqSim };
        const c = cert.find(r => r.userId === uid);
        const lastTest = last.find(r => r.userId === uid);
        return {
            done, tests, ex, sims, diag, lessonsDone, lessonsTotal: L.length,
            testsDone: testKeys.filter(k => tests[k]).length,
            testsTakenAvg: (() => { const t = testKeys.filter(k => tests[k]); return t.length ? Math.round(t.reduce((a, k) => a + tests[k].best, 0) / t.length) : 0; })(), testsTotal: testKeys.length, testsAvg: Math.round(testsAvg),
            exDone, exTotal: E.length, exAvg: Math.round(exAvg), simDone, simTotal: S.length, simAvg: Math.round(simAvg),
            overall, finalBest, req, reqEx, reqSim, eligible: req.lessons && req.final && req.exercises && req.sims,
            certificate: c ? { number: c.number, issuedAt: c.issuedAt } : null,
            lastActivity: lastTest ? new Date(lastTest.at) : null
        };
    }
    userIds.forEach(id => out.set(id, build(id)));
    return out;
}

export async function getProgress(userId: number) {
    return (await progressForUsers([userId])).get(userId)!;
}

/** Talaba uchun keyingi qadam. */
export async function nextStep(userId: number) {
    const p = await getProgress(userId);
    const cat = await catalog();
    if (!p.diag.pre) return { key: 'diag', title: 'Dastlabki diagnostikadan o‘ting', text: '12 ta qisqa savol orqali boshlang‘ich darajangizni aniqlaymiz. 3–4 daqiqa vaqt oladi.', href: '/diagnostics', cta: 'Diagnostikani boshlash', icon: 'fa-stethoscope' };
    const l = cat.lessons.find(l => !p.done.has(l.id));
    if (l) {
        const t = p.tests[`lesson:${l.id}`];
        return { key: 'lesson', title: `${cat.lessons.indexOf(l) + 1}-dars: ${l.title}`, text: t ? 'Darsni o‘qib chiqing va oxirida “O‘qildi” tugmasini bosing.' : 'Darsni o‘qing, so‘ng 6 savollik mavzu testini topshiring.', href: `/lessons/${l.id}`, cta: 'Darsni davom ettirish', icon: 'fa-book-open' };
    }
    const lt = cat.lessons.find(l => !p.tests[`lesson:${l.id}`]);
    if (lt) return { key: 'test', title: `Mavzu testi: ${lt.title}`, text: 'Har bir mavzu bo‘yicha qisqa testni topshiring.', href: `/tests/${lt.id}`, cta: 'Testni boshlash', icon: 'fa-list-check' };
    if (!p.req.exercises) {
        const e = cat.exercises.find(e => !(e.id in p.ex))!;
        return { key: 'exercise', title: `Amaliy mashq: ${e.title}`, text: `Sertifikat uchun kamida ${p.reqEx} ta mashq kerak (bajarildi: ${p.exDone}).`, href: `/exercises/${e.id}`, cta: 'Mashqni boshlash', icon: 'fa-puzzle-piece' };
    }
    if (!p.req.sims) {
        const x = cat.simulators.find(x => !(x.id in p.sims))!;
        return { key: 'sim', title: `Simulyator: ${x.title}`, text: `Virtual sinf o‘quvchilarini baholang (kerak: ${p.reqSim}, bajarildi: ${p.simDone}).`, href: `/simulators/${x.id}`, cta: 'Simulyatorni ochish', icon: 'fa-children' };
    }
    if (!p.req.final) return { key: 'final', title: 'Yakuniy test', text: `20 ta savol, 25 daqiqa. O‘tish uchun kamida ${PASS_SCORE}% kerak (hozirgi eng yaxshi natija: ${p.finalBest}%).`, href: '/tests/final', cta: 'Yakuniy testni boshlash', icon: 'fa-flag-checkered' };
    if (!p.diag.post) return { key: 'diag-post', title: 'Yakuniy diagnostika', text: 'Barcha talablar bajarildi! Yakuniy diagnostika bilan o‘sishingizni ko‘ring.', href: '/diagnostics?stage=post', cta: 'Yakuniy diagnostika', icon: 'fa-chart-line' };
    return { key: 'cert', title: 'Tabriklaymiz! Kurs yakunlandi', text: 'Sertifikatingizni yuklab oling yoki chop eting.', href: '/certificate', cta: 'Sertifikatni olish', icon: 'fa-award' };
}

export async function lessonTestKeyExists(lessonId: number) {
    const db = await getDb();
    const r = await db.select({ id: lessons.id }).from(lessons).where(and(eq(lessons.id, lessonId), eq(lessons.published, true)));
    return r.length > 0;
}

export type Progress = Awaited<ReturnType<typeof getProgress>>;
