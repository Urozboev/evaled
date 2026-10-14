import Link from 'next/link';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { lessons } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { getProgress } from '@/lib/progress';
import { Hint, PageHero, Ring, ScoreTag, StatusTag } from '@/components/ui';

export const metadata = { title: 'Nazariy darslar' };

const CHAPTERS: Record<string, string> = { 'I bob': 'I bob · Ilmiy-nazariy asoslar', 'II bob': 'II bob · Pedagogik asoslar', 'III bob': 'III bob · Samaradorlik' };

export default async function LessonsPage() {
    const user = await requireUser('/lessons');
    const db = await getDb();
    const [list, p] = await Promise.all([
        db.select({ id: lessons.id, title: lessons.title, summary: lessons.summary, icon: lessons.icon, duration: lessons.duration, chapter: lessons.chapter, goals: lessons.goals })
            .from(lessons).where(eq(lessons.published, true)).orderBy(asc(lessons.position), asc(lessons.id)),
        getProgress(user.id)
    ]);
    const pct = p.lessonsTotal ? Math.round(p.lessonsDone / p.lessonsTotal * 100) : 0;
    const chapters = [...new Set(list.map(l => l.chapter))];

    return (
        <>
            <PageHero title="Nazariy darslar" crumbs={[{ label: 'Darslar' }]}
                lead="Dissertatsiyaning uch bobi asosida tuzilgan modullar. Har bir dars: maqsadlar → nazariy material → nazorat savollari → 6 savollik mavzu testi." />
            <section className="section">
                <div className="container">
                    <Hint><b>Qanday o‘qish kerak?</b> Darslarni tartib bilan o‘qing. Dars oxirida <b>“O‘qildi”</b> tugmasini bosing va mavzu testini topshiring — shunda progress hisoblanadi.</Hint>
                    <div className="card mb-3" style={{ flexDirection: 'row', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                        <Ring pct={pct} label="Darslar" />
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <h3 className="upper mb-0">Darslar bo‘yicha progress</h3>
                            <p className="muted mb-0">{list.length} ta darsdan {p.lessonsDone} tasi o‘qib chiqilgan.</p>
                        </div>
                    </div>
                    {chapters.map(ch => (
                        <div key={ch} className="mb-3">
                            <h2 className="upper mt-3" style={{ fontSize: 20 }}>{CHAPTERS[ch] || ch}</h2>
                            <div className="grid grid-2">
                                {list.filter(l => l.chapter === ch).map(l => {
                                    const n = list.indexOf(l) + 1;
                                    const t = p.tests[`lesson:${l.id}`];
                                    const done = p.done.has(l.id);
                                    return (
                                        <article key={l.id} className="card hover">
                                            <div className="card-top"><span className="card-icon"><i className={`fas ${l.icon}`} /></span><StatusTag done={done} started={!!t} /></div>
                                            <span className="num-badge">{n}-dars</span>
                                            <h3 className="mt-1"><Link href={`/lessons/${l.id}`} style={{ color: 'inherit' }}>{l.title}</Link></h3>
                                            <p className="desc">{l.summary}</p>
                                            <div className="card-meta"><span><i className="far fa-clock" />{l.duration} daqiqa</span><span><i className="fas fa-bullseye" />{l.goals.length} ta maqsad</span><span><i className="fas fa-list-check" />Test: {t ? <ScoreTag score={t.best} /> : 'topshirilmagan'}</span></div>
                                            <div className="card-foot">
                                                <Link href={`/tests/${l.id}`} className="btn btn-outline btn-sm">Test</Link>
                                                <Link href={`/lessons/${l.id}`} className="btn btn-primary btn-sm">{done ? 'Qayta o‘qish' : 'O‘qishni boshlash'} <i className="fas fa-arrow-right" /></Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
