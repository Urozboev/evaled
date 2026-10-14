import type { ChoiceData, ClassifyData, ExerciseData, FeedbackData, MatchData, OrderData, SimStudent } from '@/db/schema';

/* Baholash funksiyalari: brauzerda darhol natija ko‘rsatish va serverda qayta tekshirish uchun bir xil. */

export type ExercisePayload =
    | { type: 'classify'; answers: Record<number, number> }
    | { type: 'match'; answers: Record<number, number> }
    | { type: 'order'; order: number[] }
    | { type: 'choice'; answers: Record<number, number> }
    | { type: 'feedback'; text: string; checks: boolean[] };

const pct = (ok: number, total: number) => (total ? Math.round(ok / total * 100) : 0);

export function feedbackAuto(d: FeedbackData, text: string) {
    const t = text.trim(), low = t.toLowerCase();
    const has = (list: string[]) => list.some(w => low.includes(w.toLowerCase()));
    const praise = has(d.praise), next = has(d.next);
    const lengthPts = t.length >= 120 ? 20 : Math.round(Math.min(t.length, 120) / 120 * 20);
    return { auto: lengthPts + (praise ? 15 : 0) + (next ? 15 : 0), praise, next, long: t.length >= 120 };
}

export function gradeExercise(data: ExerciseData, p: ExercisePayload): { score: number; correct: number; total: number } {
    switch (p.type) {
        case 'classify': {
            const d = data as ClassifyData;
            const ok = d.items.filter((it, i) => p.answers[i] === it.c).length;
            return { score: pct(ok, d.items.length), correct: ok, total: d.items.length };
        }
        case 'match': {
            const d = data as MatchData;
            const ok = d.pairs.filter((_, i) => p.answers[i] === i).length;
            return { score: pct(ok, d.pairs.length), correct: ok, total: d.pairs.length };
        }
        case 'order': {
            const d = data as OrderData;
            const ok = p.order.filter((v, i) => v === i).length;
            return { score: pct(ok, d.items.length), correct: ok, total: d.items.length };
        }
        case 'choice': {
            const d = data as ChoiceData;
            const ok = d.cases.filter((c, i) => p.answers[i] === c.a).length;
            return { score: pct(ok, d.cases.length), correct: ok, total: d.cases.length };
        }
        case 'feedback': {
            const d = data as FeedbackData;
            const { auto } = feedbackAuto(d, p.text);
            const self = Math.round(p.checks.filter(Boolean).length / (d.checklist.length || 1) * 50);
            return { score: Math.min(100, auto + self), correct: auto + self, total: 100 };
        }
    }
}

/** Ekspert bahosi bilan moslik (har bir mezon 1..3). */
export function simAgreement(scores: number[], expert: number[]) {
    if (!expert.length) return 0;
    const sum = expert.reduce((a, e, i) => a + (1 - Math.abs((scores[i] || 0) - e) / 2), 0);
    return Math.max(0, Math.round(sum / expert.length * 100));
}

export function gradeSimulator(students: SimStudent[], grades: number[][]) {
    const per = students.map((st, i) => simAgreement(grades[i] || [], st.expert));
    return { per, score: per.length ? Math.round(per.reduce((a, b) => a + b, 0) / per.length) : 0 };
}

export function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

export const scoreTone = (p: number) => (p >= 85 ? 'green' : p >= 60 ? 'amber' : 'red');

/** Urug‘li (deterministik) aralashtirish — server va brauzerda bir xil natija beradi. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
    let s = (seed >>> 0) || 1;
    const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}
