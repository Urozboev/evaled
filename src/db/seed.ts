import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local', override: true });

import bcrypt from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';
import { createDb } from './client';
import * as s from './schema';
import { SEED_LESSONS } from './seed-lessons';
import { SEED_EXERCISES, SEED_GLOSSARY, SEED_SIMULATORS, SEED_TOOLS } from './seed-content';

/** Kontentni faqat bo‘sh bazaga yuklaydi; adminni faqat mavjud bo‘lmasa yaratadi. Qayta ishga tushirish xavfsiz. */
async function main() {
    const db = await createDb();

    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(s.lessons);
    if (n === 0) {
        const lessonIds: number[] = [];
        for (const [i, l] of SEED_LESSONS.entries()) {
            const [row] = await db.insert(s.lessons).values({
                position: i + 1, chapter: l.chapter, title: l.title, summary: l.summary, icon: l.icon, duration: l.duration,
                goals: l.goals, content: l.content, terms: l.terms, reviewQuestions: l.review
            }).returning({ id: s.lessons.id });
            lessonIds.push(row.id);
            await db.insert(s.questions).values(l.questions.map((q, qi) => ({
                lessonId: row.id, position: qi + 1, text: q.q, options: q.o, correct: q.a, explanation: q.e
            })));
        }
        await db.insert(s.exercises).values(SEED_EXERCISES.map((e, i) => ({
            position: i + 1, lessonId: lessonIds[e.lesson - 1], type: e.type, title: e.title, summary: e.summary,
            task: e.task, icon: e.icon, level: e.level, duration: e.duration, data: e.data
        })));
        await db.insert(s.simulators).values(SEED_SIMULATORS.map((x, i) => ({ position: i + 1, ...x })));
        await db.insert(s.tools).values(SEED_TOOLS.map((t, i) => ({ position: i + 1, ...t })));
        await db.insert(s.glossary).values(SEED_GLOSSARY.map(([term, definition]) => ({ term, definition })));
        console.log(`✓ Kontent yuklandi: ${SEED_LESSONS.length} dars, ${SEED_EXERCISES.length} mashq, ${SEED_SIMULATORS.length} simulyator`);
    } else {
        console.log('• Kontent allaqachon mavjud — o‘tkazib yuborildi');
    }

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) {
        const existing = await db.select({ id: s.users.id }).from(s.users).where(eq(s.users.email, email));
        if (existing.length === 0) {
            if (password.length < 8) throw new Error('ADMIN_PASSWORD kamida 8 belgidan iborat bo‘lishi kerak');
            await db.insert(s.users).values({ email, fullName: 'Administrator', role: 'admin', passwordHash: await bcrypt.hash(password, 10) });
            console.log(`✓ Administrator yaratildi: ${email}`);
        } else {
            console.log(`• Administrator mavjud: ${email}`);
        }
    } else {
        console.log('• ADMIN_EMAIL / ADMIN_PASSWORD berilmagan — administrator yaratilmadi');
    }
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
