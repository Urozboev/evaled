import Link from 'next/link';
import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { exercises } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { EXERCISE_TYPES } from '@/lib/content';
import { getProgress } from '@/lib/progress';
import { Hint, LevelTag, PageHero, ScoreTag } from '@/components/ui';

export const metadata = { title: 'Amaliy mashqlar' };

export default async function ExercisesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    const user = await requireUser('/exercises');
    const { type } = await searchParams;
    const db = await getDb();
    const [list, p] = await Promise.all([
        db.select({ id: exercises.id, title: exercises.title, summary: exercises.summary, icon: exercises.icon, level: exercises.level, duration: exercises.duration, type: exercises.type })
            .from(exercises).where(eq(exercises.published, true)).orderBy(asc(exercises.position), asc(exercises.id)),
        getProgress(user.id)
    ]);
    const shown = list.filter(e => !type || e.type === type);
    const avg = p.exDone ? Math.round(Object.values(p.ex).reduce((a, b) => a + b, 0) / p.exDone) : 0;
    return (
        <>
            <PageHero title="Amaliy mashqlar" crumbs={[{ label: 'Mashqlar' }]} lead="Tasniflash, moslashtirish, tartiblash, pedagogik vaziyatlar (keys) va teskari aloqa yozish orqali baholash ko‘nikmalarini mustahkamlang." />
            <section className="section">
                <div className="container">
                    <Hint>Sertifikat uchun kamida <b>{p.reqEx} ta</b> mashqni bajaring. Har bir mashqdan so‘ng natija va izohlar darhol ko‘rsatiladi; qayta bajarish mumkin.</Hint>
                    <div className="grid grid-4 mb-3">
                        {[['fa-puzzle-piece', list.length, 'Jami mashqlar'], ['fa-circle-check', p.exDone, 'Bajarilgan'], ['fa-hourglass-half', Math.max(0, list.length - p.exDone), 'Qolgan'], ['fa-percent', `${avg}%`, 'O‘rtacha natija']].map(([i, v, l]) => (
                            <div key={l as string} className="card kpi"><span className="card-icon"><i className={`fas ${i}`} /></span><div><b>{v}</b><span>{l}</span></div></div>
                        ))}
                    </div>
                    <div className="filters">
                        <Link href="/exercises" className={`chip ${!type ? 'on' : ''}`}>Barchasi</Link>
                        {Object.entries(EXERCISE_TYPES).map(([k, v]) => <Link key={k} href={`/exercises?type=${k}`} className={`chip ${type === k ? 'on' : ''}`}>{v}</Link>)}
                    </div>
                    <div className="grid grid-3">
                        {shown.map(e => {
                            const r = p.ex[e.id];
                            return (
                                <Link key={e.id} className="card hover" href={`/exercises/${e.id}`} style={{ color: 'inherit' }}>
                                    <div className="card-top"><span className="card-icon"><i className={`fas ${e.icon}`} /></span>{r !== undefined ? <ScoreTag score={r} /> : <span className="tag">{EXERCISE_TYPES[e.type]}</span>}</div>
                                    <h3>{e.title}</h3>
                                    <p className="desc">{e.summary}</p>
                                    <div className="card-meta"><span><i className="far fa-clock" />{e.duration} daqiqa</span><span><i className="fas fa-shapes" />{EXERCISE_TYPES[e.type]}</span></div>
                                    <div className="card-foot"><LevelTag level={e.level} /><span className="link-arrow">{r !== undefined ? 'Qayta bajarish' : 'Boshlash'} <i className="fas fa-arrow-right" /></span></div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
