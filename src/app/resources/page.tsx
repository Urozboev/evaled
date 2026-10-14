import Link from 'next/link';
import { asc, ilike, or } from 'drizzle-orm';
import { getDb } from '@/db';
import { glossary } from '@/db/schema';
import { DOCS, METHODS } from '@/lib/content';
import { PageHero } from '@/components/ui';

export const metadata = { title: 'Resurslar' };

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q = '' } = await searchParams;
    const db = await getDb();
    const term = q.trim().split(/\s+/)[0] || '';
    const list = await db.select().from(glossary)
        .where(term ? or(ilike(glossary.term, `%${term}%`), ilike(glossary.definition, `%${term}%`)) : undefined)
        .orderBy(asc(glossary.term));
    const letters = [...new Set(list.map(g => g.term[0].toUpperCase()))];

    return (
        <>
            <PageHero title="Resurslar" crumbs={[{ label: 'Resurslar' }]} lead="Raqamli vositalar, atamalar lug‘ati, formativ baholash usullari, me’yoriy hujjatlar va tayyor shablonlar." />
            <section className="section tight">
                <div className="container">
                    <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                        <Link className="tile" href="/tools"><span className="tile-icon"><i className="fas fa-laptop-code" /></span><h3>Raqamli vositalar</h3><p>16 ta vosita va maslahatlar</p></Link>
                        <a className="tile" href="#glossary"><span className="tile-icon"><i className="fas fa-book" /></span><h3>Glossariy</h3><p>Baholashga oid atamalar</p></a>
                        <a className="tile" href="#methods"><span className="tile-icon"><i className="fas fa-lightbulb" /></span><h3>Formativ usullar</h3><p>Boshlang‘ich sinf uchun</p></a>
                        <Link className="tile" href="/about"><span className="tile-icon"><i className="fas fa-chart-column" /></span><h3>Tadqiqot</h3><p>Natijalar va tavsiyalar</p></Link>
                    </div>
                </div>
            </section>
            <section className="section" style={{ paddingTop: 20 }}>
                <div className="container with-aside">
                    <div style={{ minWidth: 0 }}>
                        <div className="flex between items-center wrap gap-2" id="glossary" style={{ scrollMarginTop: 100 }}>
                            <h2 className="upper mb-0" style={{ fontSize: 26 }}>Glossariy</h2>
                            <form className="search-input" action="/resources#glossary">
                                <i className="fas fa-magnifying-glass" />
                                <input className="input" name="q" type="search" defaultValue={q} placeholder="Atamani qidirish…" aria-label="Atamani qidirish" style={{ minWidth: 260 }} />
                            </form>
                        </div>
                        {q && <p className="small muted mt-1">“{q}” bo‘yicha natijalar · <Link href="/resources#glossary">Barchasini ko‘rsatish</Link></p>}
                        {list.length === 0 && <p className="muted mt-2">Atama topilmadi.</p>}
                        {letters.map(L => (
                            <div key={L}>
                                <div className="gloss-letter" id={`L-${L}`}>{L}</div>
                                {list.filter(g => g.term[0].toUpperCase() === L).map(g => <div key={g.id} className="gloss-item"><b>{g.term}</b> — {g.definition}</div>)}
                            </div>
                        ))}

                        <h2 className="upper mt-4" id="methods" style={{ fontSize: 26, scrollMarginTop: 100 }}>Boshlang‘ich sinf uchun formativ baholash usullari</h2>
                        <div className="grid grid-2">
                            {METHODS.map(([i, t, d]) => <div key={t} className="card" style={{ flexDirection: 'row', gap: 14, padding: 18 }}><span className="card-icon"><i className={`fas ${i}`} /></span><div><b style={{ color: 'var(--navy)' }}>{t}</b><div className="small muted">{d}</div></div></div>)}
                        </div>

                        <h2 className="upper mt-4" id="docs" style={{ fontSize: 26, scrollMarginTop: 100 }}>Me’yoriy-huquqiy hujjatlar</h2>
                        {DOCS.map(([n, d, t]) => (
                            <details key={n} className="acc"><summary><span><span className="tag">{n}</span>&nbsp; {t}</span></summary>
                                <div className="acc-body small muted">{d ? `Qabul qilingan sana: ${d}. ` : ''}Mazkur hujjatda belgilangan vazifalarni amalga oshirishda dissertatsiya tadqiqoti muayyan darajada xizmat qiladi. Rasmiy matn: <a href="https://lex.uz" target="_blank" rel="noopener noreferrer">lex.uz</a></div>
                            </details>
                        ))}

                        <h2 className="upper mt-4" id="templates" style={{ fontSize: 26, scrollMarginTop: 100 }}>Shablonlar</h2>
                        <div className="grid grid-2">
                            <div className="card"><h3 style={{ fontSize: 18 }}><i className="fas fa-ticket" style={{ color: 'var(--primary)' }} /> Chiqish chiptasi</h3><ol className="mb-0 small" style={{ paddingLeft: 18 }}><li>Bugun men … ni o‘rgandim.</li><li>Menga eng qiziq bo‘lgani …</li><li>Hali tushunmaganim …</li></ol></div>
                            <div className="card"><h3 style={{ fontSize: 18 }}><i className="fas fa-star" style={{ color: 'var(--primary)' }} /> Ikki yulduz – bitta tilak</h3><ul className="mb-0 small" style={{ paddingLeft: 0, listStyle: 'none' }}><li>⭐ Menga yoqdi: …</li><li>⭐ Yaxshi chiqqan: …</li><li>💡 Tavsiyam: …</li></ul></div>
                            <div className="card"><h3 style={{ fontSize: 18 }}><i className="fas fa-traffic-light" style={{ color: 'var(--primary)' }} /> Svetofor varag‘i</h3><ul className="mb-0 small" style={{ paddingLeft: 0, listStyle: 'none' }}><li>🟢 Tushundim, boshqaga tushuntira olaman</li><li>🟡 Qisman tushundim, savolim bor</li><li>🔴 Yordam kerak</li></ul></div>
                            <div className="card"><h3 style={{ fontSize: 18 }}><i className="fas fa-rotate" style={{ color: 'var(--primary)' }} /> O‘qituvchi refleksiyasi</h3><ol className="mb-0 small" style={{ paddingLeft: 18 }}><li>Nima bo‘ldi? (natija, faktlar)</li><li>Nima uchun? (sabablar)</li><li>Endi nima qilaman? (reja)</li></ol></div>
                        </div>
                    </div>
                    <aside className="aside-sticky">
                        <div className="card">
                            <h4 className="upper" style={{ fontSize: 15 }}>Bo‘limlar</h4>
                            <nav className="toc">
                                <a href="#glossary"><span className="n"><i className="fas fa-book" /></span>Glossariy</a>
                                <a href="#methods"><span className="n"><i className="fas fa-lightbulb" /></span>Formativ usullar</a>
                                <a href="#docs"><span className="n"><i className="fas fa-scale-balanced" /></span>Me’yoriy hujjatlar</a>
                                <a href="#templates"><span className="n"><i className="fas fa-file-lines" /></span>Shablonlar</a>
                                <Link href="/tools"><span className="n"><i className="fas fa-laptop-code" /></span>Raqamli vositalar</Link>
                            </nav>
                        </div>
                        {letters.length > 0 && <div className="card" style={{ background: 'var(--soft)' }}><h4 className="upper" style={{ fontSize: 15 }}>Alifbo</h4><div className="flex wrap" style={{ gap: 6 }}>{letters.map(l => <a key={l} href={`#L-${l}`} className="chip" style={{ padding: '4px 10px' }}>{l}</a>)}</div></div>}
                    </aside>
                </div>
            </section>
        </>
    );
}
