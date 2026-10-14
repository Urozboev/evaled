import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { lessons, questions } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { FINAL_COUNT, FINAL_MINUTES, LESSON_TEST_MINUTES } from '@/lib/content';
import { shuffle } from '@/lib/grading';
import { catalog, getProgress } from '@/lib/progress';
import { PageHero } from '@/components/ui';
import { QuizClient, type ClientQuestion } from '@/components/QuizClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Test' };

export default async function TestPage({ params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const user = await requireUser(`/tests/${key}`);
    const db = await getDb();
    const isFinal = key === 'final';
    let title = 'Yakuniy test', lessonId: number | null = null, nextHref = '/certificate';
    let rows: (typeof questions.$inferSelect)[];

    if (isFinal) {
        rows = await db.select({ q: questions }).from(questions).innerJoin(lessons, eq(lessons.id, questions.lessonId)).where(eq(lessons.published, true)).then(r => r.map(x => x.q));
        rows = shuffle(rows).slice(0, FINAL_COUNT);
    } else {
        lessonId = Number(key);
        const [L] = await db.select({ id: lessons.id, title: lessons.title }).from(lessons).where(and(eq(lessons.id, lessonId || 0), eq(lessons.published, true)));
        if (!L) notFound();
        title = L.title;
        rows = shuffle(await db.select().from(questions).where(eq(questions.lessonId, L.id))).slice(0, 10);
        const cat = await catalog();
        const i = cat.lessons.findIndex(l => l.id === L.id);
        nextHref = cat.lessons[i + 1] ? `/lessons/${cat.lessons[i + 1].id}` : '/tests/final';
    }

    // To‘g‘ri javoblar brauzerga yuborilmaydi; variantlar aralashtiriladi, asl indeks saqlanadi.
    const qs: ClientQuestion[] = rows.map(r => ({ id: r.id, text: r.text, options: shuffle(r.options.map((t, i) => ({ i, t }))) }));
    const testKey = isFinal ? 'final' : `lesson:${lessonId}`;
    const prev = (await getProgress(user.id)).tests[testKey];

    return (
        <>
            <PageHero title={isFinal ? 'Yakuniy test' : 'Mavzu testi'} crumbs={[{ label: 'Testlar', href: '/tests' }, { label: isFinal ? 'Yakuniy test' : 'Mavzu testi' }]} lead={title} />
            <section className="section">
                <div className="container">
                    {qs.length === 0
                        ? <div className="card center"><p className="muted mb-0">Bu mavzu uchun hali savollar qo‘shilmagan.</p></div>
                        : <QuizClient testKey={testKey} title={title} kind={isFinal ? 'Yakuniy test' : 'Mavzu testi'} minutes={isFinal ? FINAL_MINUTES : LESSON_TEST_MINUTES}
                            questions={qs} prev={prev ? { best: prev.best, tries: prev.tries } : null} lessonId={lessonId} nextHref={nextHref} />}
                </div>
            </section>
        </>
    );
}
