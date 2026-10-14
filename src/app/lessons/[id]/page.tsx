import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { exercises, lessons } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { getProgress } from '@/lib/progress';
import { Markdown, headingsOf } from '@/components/Markdown';
import { DoneBox, Toc } from '@/components/LessonClient';
import { PageHero } from '@/components/ui';

function videoEmbed(url: string) {
    const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url);
    if (yt) return { kind: 'iframe' as const, src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { kind: 'video' as const, src: url };
    return { kind: 'link' as const, src: url };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = await getDb();
    const [l] = await db.select({ title: lessons.title }).from(lessons).where(eq(lessons.id, Number(id) || 0));
    return { title: l?.title || 'Dars' };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: raw } = await params;
    const id = Number(raw);
    const user = await requireUser(`/lessons/${raw}`);
    const db = await getDb();
    const all = await db.select({ id: lessons.id, title: lessons.title }).from(lessons).where(eq(lessons.published, true)).orderBy(asc(lessons.position), asc(lessons.id));
    const [L] = await db.select().from(lessons).where(and(eq(lessons.id, id || 0), eq(lessons.published, true)));
    if (!L) notFound();
    const [p, related] = await Promise.all([
        getProgress(user.id),
        db.select({ id: exercises.id, title: exercises.title, icon: exercises.icon }).from(exercises).where(and(eq(exercises.lessonId, id), eq(exercises.published, true)))
    ]);
    const idx = all.findIndex(l => l.id === id);
    const prev = all[idx - 1], next = all[idx + 1];
    const toc = headingsOf(L.content);
    const t = p.tests[`lesson:${id}`];
    const video = L.videoUrl ? videoEmbed(L.videoUrl) : null;

    return (
        <>
            <PageHero title={L.title} crumbs={[{ label: 'Darslar', href: '/lessons' }, { label: `${idx + 1}-dars` }]} lead={L.summary}>
                <div className="hero-meta" style={{ justifyContent: 'flex-start', marginTop: 18 }}>
                    <span><i className="fas fa-bookmark" />{L.chapter}</span><span><i className="far fa-clock" />{L.duration} daqiqa</span><span><i className="fas fa-list-check" />Mavzu testi</span>
                </div>
            </PageHero>
            <section className="section">
                <div className="container with-aside">
                    <div style={{ minWidth: 0 }}>
                        <div className="card mb-3">
                            <h3 className="upper" style={{ fontSize: 16 }}><i className="fas fa-bullseye" style={{ color: 'var(--primary)' }} /> Dars maqsadlari</h3>
                            <ul className="mb-0" style={{ paddingLeft: 20 }}>{L.goals.map((g, i) => <li key={i}>{g}</li>)}</ul>
                        </div>
                        {video && (
                            <div className="mb-3">
                                {video.kind === 'iframe' && <div className="video-box"><iframe src={video.src} title="Videodars" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /></div>}
                                {video.kind === 'video' && <div className="video-box"><video src={video.src} controls /></div>}
                                {video.kind === 'link' && <a href={video.src} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><i className="fas fa-circle-play" />Videodarsni ochish</a>}
                            </div>
                        )}
                        {L.pdfUrl && <a href={L.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mb-3"><i className="fas fa-file-pdf" />PDF materialni yuklab olish</a>}

                        <article className="article"><Markdown>{L.content}</Markdown></article>

                        {L.terms.length > 0 && (
                            <div className="card mt-4">
                                <h3 className="upper" style={{ fontSize: 16 }}><i className="fas fa-tags" style={{ color: 'var(--primary)' }} /> Tayanch tushunchalar</h3>
                                <div className="terms">{L.terms.map(term => <Link key={term} className="tag" href={`/resources?q=${encodeURIComponent(term)}#glossary`}>{term}</Link>)}</div>
                            </div>
                        )}
                        {L.reviewQuestions.length > 0 && (
                            <div className="card mt-3">
                                <h3 className="upper" style={{ fontSize: 16 }}><i className="fas fa-circle-question" style={{ color: 'var(--primary)' }} /> O‘zingizni tekshiring</h3>
                                <ol className="mb-0" style={{ paddingLeft: 20 }}>{L.reviewQuestions.map((q, i) => <li key={i}>{q}</li>)}</ol>
                            </div>
                        )}

                        <DoneBox lessonId={id} initial={p.done.has(id)} testHref={`/tests/${id}`} testScore={t ? t.best : null} />

                        <div className="flex between wrap gap-2 mt-3">
                            {prev ? <Link href={`/lessons/${prev.id}`} className="btn btn-outline"><i className="fas fa-arrow-left" />Oldingi dars</Link> : <span />}
                            {next ? <Link href={`/lessons/${next.id}`} className="btn btn-primary">Keyingi dars<i className="fas fa-arrow-right" /></Link>
                                : <Link href="/dashboard" className="btn btn-primary">Mening sahifam<i className="fas fa-arrow-right" /></Link>}
                        </div>
                    </div>

                    <aside className="aside-sticky">
                        {toc.length > 0 && <div className="card"><h4 className="upper" style={{ fontSize: 15 }}>Dars mundarijasi</h4><Toc items={toc} /></div>}
                        <div className="card">
                            <h4 className="upper" style={{ fontSize: 15 }}>Barcha darslar</h4>
                            <nav className="toc">
                                {all.map((l, i) => <Link key={l.id} href={`/lessons/${l.id}`} className={l.id === id ? 'active' : ''}><span className="n">{i + 1}</span><span>{l.title}</span>{p.done.has(l.id) && <i className="fas fa-circle-check ok" />}</Link>)}
                            </nav>
                        </div>
                        {related.length > 0 && (
                            <div className="card" style={{ background: 'var(--soft)' }}>
                                <h4 className="upper" style={{ fontSize: 15 }}>Mavzu bo‘yicha mashqlar</h4>
                                <div className="flex" style={{ flexDirection: 'column', gap: 8 }}>
                                    {related.map(e => <Link key={e.id} href={`/exercises/${e.id}`} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start', textTransform: 'none' }}><i className={`fas ${e.icon}`} />{e.title}</Link>)}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </section>
        </>
    );
}
