import Link from 'next/link';
import { asc } from 'drizzle-orm';
import { getDb } from '@/db';
import { tools } from '@/db/schema';
import { PageHero } from '@/components/ui';

export const metadata = { title: 'Raqamli baholash vositalari' };

export default async function ToolsPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
    const { c } = await searchParams;
    const db = await getDb();
    const list = await db.select().from(tools).orderBy(asc(tools.position), asc(tools.id));
    const cats = [...new Set(list.map(t => t.category))];
    return (
        <>
            <PageHero title="Raqamli baholash vositalari" crumbs={[{ label: 'Resurslar', href: '/resources' }, { label: 'Vositalar' }]}
                lead="“Digital Assessment Tools”: videodars, interaktiv resurs, ovozli ta’lim, onlayn so‘rov va LMS platformalarining baholashdagi imkoniyatlari hamda amaliy maslahatlar." />
            <section className="section">
                <div className="container">
                    <div className="filters">
                        <Link href="/tools" className={`chip ${!c ? 'on' : ''}`}>Barchasi</Link>
                        {cats.map(x => <Link key={x} href={`/tools?c=${encodeURIComponent(x)}`} className={`chip ${c === x ? 'on' : ''}`}>{x}</Link>)}
                    </div>
                    <div className="grid grid-3">
                        {list.filter(t => !c || t.category === c).map(t => (
                            <article key={t.id} className="card hover">
                                <div className="card-top"><span className="card-icon"><i className={`fas ${t.icon}`} /></span><span className="tag">{t.category}</span></div>
                                <h3>{t.name}</h3>
                                <p className="desc">{t.use}</p>
                                {t.tip && <div className="callout" style={{ margin: '4px 0 14px', padding: '10px 14px', fontSize: 14 }}><b>Maslahat</b>{t.tip}</div>}
                                <div className="card-foot">
                                    <span className="flex wrap" style={{ gap: 6 }}>{t.kinds.map(k => <span key={k} className={`tag ${k === 'Formativ' ? 'green' : k === 'Summativ' ? 'amber' : 'gray'}`}>{k}</span>)}</span>
                                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="link-arrow">Sayt <i className="fas fa-arrow-up-right-from-square" /></a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
            <section className="section soft">
                <div className="container">
                    <h2 className="sec-title">Qaysi vositani tanlash kerak?</h2>
                    <p className="sec-lead">Baholash maqsadiga ko‘ra tezkor yo‘riqnoma</p>
                    <div className="table-wrap" style={{ background: '#fff' }}>
                        <table className="tbl">
                            <thead><tr><th>Maqsad</th><th>Javob turi</th><th>Tavsiya etilgan vositalar</th></tr></thead>
                            <tbody>
                                <tr><td>Mavzu boshida bilimni aniqlash (diagnostik)</td><td>Yopiq savollar</td><td>Google Forms, Plickers</td></tr>
                                <tr><td>Darsda tushunishni tezkor tekshirish (formativ)</td><td>Tanlov, so‘z</td><td>Mentimeter, Kahoot!, Plickers</td></tr>
                                <tr><td>Bilimni o‘yin orqali mustahkamlash</td><td>Moslashtirish, guruhlash</td><td>Wordwall, H5P, Genially</td></tr>
                                <tr><td>O‘qish texnikasi, og‘zaki nutqni baholash</td><td>Audio</td><td>Vocaroo, MS Teams Reading Progress</td></tr>
                                <tr><td>O‘zaro baholash (peer assessment)</td><td>Matn, mahsulot</td><td>Moodle Workshop, Padlet</td></tr>
                                <tr><td>Yakuniy nazorat (summativ)</td><td>Test, loyiha</td><td>Moodle, Google Classroom, Google Forms</td></tr>
                                <tr><td>Refleksiya</td><td>Ochiq javob</td><td>Mentimeter, Google Forms, Padlet</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}
