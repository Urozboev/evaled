import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { lessons, questions } from '@/db/schema';
import { LessonEditor, QuestionsEditor } from '@/components/admin/LessonEditor';

export const metadata = { title: 'Darsni tahrirlash' };

export default async function EditLesson({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isNew = id === 'new';
    const db = await getDb();
    const L = isNew ? null : (await db.select().from(lessons).where(eq(lessons.id, Number(id) || 0)))[0];
    if (!isNew && !L) notFound();
    const qs = L ? await db.select().from(questions).where(eq(questions.lessonId, L.id)).orderBy(asc(questions.position), asc(questions.id)) : [];
    const maxPos = isNew ? ((await db.select({ p: lessons.position }).from(lessons)).reduce((a, r) => Math.max(a, r.p), 0) + 1) : 0;

    return (
        <>
            <div className="panel-head">
                <div><Link href="/admin/lessons" className="small"><i className="fas fa-arrow-left" /> Darslar</Link><h1 className="mt-1">{isNew ? 'Yangi dars' : L!.title}</h1></div>
            </div>
            <LessonEditor id={L?.id ?? null} initial={L ? {
                title: L.title, chapter: L.chapter, summary: L.summary, icon: L.icon, duration: L.duration, position: L.position, published: L.published,
                goals: L.goals, terms: L.terms, reviewQuestions: L.reviewQuestions, content: L.content, videoUrl: L.videoUrl || '', pdfUrl: L.pdfUrl || ''
            } : {
                title: '', chapter: 'I bob', summary: '', icon: 'fa-book-open', duration: 20, position: maxPos, published: false,
                goals: [''], terms: [], reviewQuestions: [], content: '## Birinchi bo‘lim\n\nMatn…', videoUrl: '', pdfUrl: ''
            }} />
            {L && (
                <div className="mt-4" id="questions">
                    <div className="panel-head"><div><h1 style={{ fontSize: 22 }}>Mavzu testi savollari</h1><p>{qs.length} ta savol · to‘g‘ri javob yashil rangda</p></div></div>
                    <QuestionsEditor lessonId={L.id} initial={qs.map(q => ({ text: q.text, options: q.options, correct: q.correct, explanation: q.explanation }))} />
                </div>
            )}
            {isNew && <p className="small muted mt-2">Savollarni dars saqlangandan so‘ng qo‘shishingiz mumkin.</p>}
        </>
    );
}
