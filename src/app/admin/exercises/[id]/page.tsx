import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { exercises, lessons } from '@/db/schema';
import { ExerciseEditor } from '@/components/admin/ExerciseEditor';

export const metadata = { title: 'Mashqni tahrirlash' };

export default async function EditExercise({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isNew = id === 'new';
    const db = await getDb();
    const E = isNew ? null : (await db.select().from(exercises).where(eq(exercises.id, Number(id) || 0)))[0];
    if (!isNew && !E) notFound();
    const ls = await db.select({ id: lessons.id, title: lessons.title }).from(lessons).orderBy(asc(lessons.position));
    const maxPos = (await db.select({ p: exercises.position }).from(exercises)).reduce((a, r) => Math.max(a, r.p), 0) + 1;
    return (
        <>
            <div className="panel-head"><div><Link href="/admin/exercises" className="small"><i className="fas fa-arrow-left" /> Mashqlar</Link><h1 className="mt-1">{E ? E.title : 'Yangi mashq'}</h1></div></div>
            <ExerciseEditor id={E?.id ?? null} lessons={ls} initial={E ? {
                type: E.type, title: E.title, summary: E.summary, task: E.task, icon: E.icon, level: E.level, duration: E.duration, position: E.position, lessonId: E.lessonId, published: E.published, data: E.data
            } : {
                type: 'classify', title: '', summary: '', task: '', icon: 'fa-puzzle-piece', level: 'medium', duration: 10, position: maxPos, lessonId: null, published: false,
                data: { categories: ['Birinchi toifa', 'Ikkinchi toifa'], items: [{ t: '', c: 0 }] }
            }} />
        </>
    );
}
