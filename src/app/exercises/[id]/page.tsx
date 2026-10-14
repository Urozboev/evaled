import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { exercises } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { EXERCISE_TYPES } from '@/lib/content';
import { getProgress } from '@/lib/progress';
import { LevelTag, PageHero } from '@/components/ui';
import { ExerciseClient } from '@/components/ExerciseClient';

export const metadata = { title: 'Mashq' };

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: raw } = await params;
    const user = await requireUser(`/exercises/${raw}`);
    const db = await getDb();
    const [E] = await db.select().from(exercises).where(and(eq(exercises.id, Number(raw) || 0), eq(exercises.published, true)));
    if (!E) notFound();
    const [all, p] = await Promise.all([
        db.select({ id: exercises.id, title: exercises.title, icon: exercises.icon }).from(exercises).where(eq(exercises.published, true)).orderBy(asc(exercises.position), asc(exercises.id)),
        getProgress(user.id)
    ]);
    const next = all[all.findIndex(e => e.id === E.id) + 1];

    return (
        <>
            <PageHero title={E.title} crumbs={[{ label: 'Mashqlar', href: '/exercises' }, { label: EXERCISE_TYPES[E.type] }]} lead={E.summary} />
            <section className="section">
                <div className="container with-aside">
                    <div style={{ minWidth: 0 }}>
                        <div className="callout" style={{ marginTop: 0 }}><b>Topshiriq</b>{E.task}</div>
                        <ExerciseClient seed={Math.floor(Math.random() * 1e9)} id={E.id} type={E.type} data={E.data} nextHref={next ? `/exercises/${next.id}` : '/simulators'} nextLabel={next ? 'Keyingi mashq' : 'Simulyatorlarga o‘tish'} />
                    </div>
                    <aside className="aside-sticky">
                        <div className="card">
                            <h4 className="upper" style={{ fontSize: 15 }}>Mashq haqida</h4>
                            <div className="req"><i className="fas fa-shapes" style={{ color: 'var(--primary)' }} />Turi<span className="val">{EXERCISE_TYPES[E.type]}</span></div>
                            <div className="req"><i className="fas fa-signal" style={{ color: 'var(--primary)' }} />Qiyinlik<span className="val"><LevelTag level={E.level} /></span></div>
                            <div className="req"><i className="far fa-clock" style={{ color: 'var(--primary)' }} />Vaqt<span className="val">{E.duration} daqiqa</span></div>
                            <div className="req" style={{ border: 0 }}><i className="fas fa-trophy" style={{ color: 'var(--primary)' }} />Eng yaxshi natija<span className="val">{p.ex[E.id] !== undefined ? `${p.ex[E.id]}%` : '—'}</span></div>
                            {E.lessonId && <Link className="btn btn-outline btn-sm mt-2" href={`/lessons/${E.lessonId}`}><i className="fas fa-book-open" />Tegishli dars</Link>}
                        </div>
                        <div className="card">
                            <h4 className="upper" style={{ fontSize: 15 }}>Boshqa mashqlar</h4>
                            <nav className="toc">{all.map(e => <Link key={e.id} href={`/exercises/${e.id}`} className={e.id === E.id ? 'active' : ''}><span className="n"><i className={`fas ${e.icon}`} /></span><span>{e.title}</span>{p.ex[e.id] !== undefined && <i className="fas fa-circle-check ok" />}</Link>)}</nav>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
