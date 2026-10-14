import { PageHero } from '@/components/ui';
import { ResultsChart } from '@/components/ResultsChart';
import { RESEARCH, SITE } from '@/lib/content';

export const metadata = { title: 'Tadqiqot haqida' };

export default function AboutPage() {
    const R = RESEARCH;
    return (
        <>
            <PageHero title="Tadqiqot haqida" crumbs={[{ label: 'Tadqiqot' }]}
                lead={<><b>{SITE.title}</b><br /><span style={{ opacity: .85 }}>{SITE.degree} ilmiy darajasini olish uchun yozilgan dissertatsiya · {SITE.year}</span></>} />

            <section className="section tight">
                <div className="container grid grid-3">
                    {[['fa-user-pen', 'Tadqiqotchi', SITE.author, `${SITE.authorRole}, ${SITE.org}`], ['fa-user-tie', 'Ilmiy rahbar', SITE.supervisor, SITE.supervisorRole], ['fa-scroll', 'Ixtisoslik', SITE.specialty, SITE.degree]].map(([i, k, t, d]) => (
                        <div key={k} className="card"><span className="card-icon mb-2"><i className={`fas ${i}`} /></span><span className="muted small upper">{k}</span><h3 className="mt-1" style={{ fontSize: k === 'Ixtisoslik' ? 17 : 20 }}>{t}</h3><p className="desc small mb-0">{d}</p></div>
                    ))}
                </div>
            </section>

            <section className="section soft">
                <div className="container">
                    <h2 className="sec-title">Tadqiqot maqsadi, obyekti va predmeti</h2>
                    <p className="sec-lead">Dissertatsiya tadqiqotining asosiy metodologik tavsifi</p>
                    <div className="grid grid-3">
                        {[['fa-bullseye', 'Maqsad', R.goal], ['fa-users', 'Obyekt', R.object], ['fa-cubes', 'Predmet', R.subject]].map(([i, t, d]) => (
                            <div key={t} className="card"><div className="card-top"><span className="card-icon"><i className={`fas ${i}`} /></span></div><h3 className="upper" style={{ fontSize: 18 }}>{t}</h3><p className="desc mb-0">{d}</p></div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container grid grid-2" style={{ gap: 40 }}>
                    <div>
                        <h2 className="upper" style={{ fontSize: 24 }}>Tadqiqot vazifalari</h2>
                        {R.tasks.map((t, i) => <div key={i} className="flex gap-2 mb-2"><span className="tile-icon" style={{ width: 40, height: 40, fontSize: 16, margin: 0, flexShrink: 0, fontFamily: 'var(--font-head)', fontWeight: 700 }}>{i + 1}</span><p className="mb-0">{t}</p></div>)}
                    </div>
                    <div>
                        <h2 className="upper" style={{ fontSize: 24 }}>Ilmiy yangiligi</h2>
                        {R.novelty.map((t, i) => <div key={i} className="callout" style={{ marginTop: 0 }}>{t}</div>)}
                    </div>
                </div>
            </section>

            <section className="section soft">
                <div className="container">
                    <h2 className="sec-title">Dissertatsiya tuzilishi</h2>
                    <p className="sec-lead">Platformadagi darslar ushbu boblar asosida tuzilgan</p>
                    <div style={{ maxWidth: 900, margin: '0 auto' }}>
                        {R.chapters.map((c, i) => <details key={i} className="acc" open={i === 0}><summary>{c.t}</summary><div className="acc-body"><ul className="mb-0">{c.p.map(p => <li key={p}>{p}</li>)}</ul></div></details>)}
                    </div>
                </div>
            </section>

            <section className="section" id="results" style={{ scrollMarginTop: 80 }}>
                <div className="container">
                    <h2 className="sec-title">Tajriba-sinov ishlari natijalari</h2>
                    <p className="sec-lead">Buxoro DPI, Andijon DPI va Guliston DU — jami 435 nafar talaba (218 tajriba, 217 nazorat guruhi)</p>
                    <div className="steps">{R.stages.map(s => <div key={s.t} className="step"><h4>{s.t}</h4><p>{s.d}</p></div>)}</div>
                    <ResultsChart />
                    <div className="grid grid-2 mt-3">
                        <div className="callout" style={{ margin: 0 }}><b>Statistik tahlil (tajriba boshi)</b>Reproduktiv mezon bo‘yicha n₁ = 218, n₂ = 217 uchun χ²<sub>kuzatuv</sub> = 0,08 &lt; χ²<sub>kritik</sub> = 5,99 (S = 3). H₀ gipotezani rad etishga asos yo‘q — guruhlar darajasi tajriba boshida bir xil bo‘lgan.</div>
                        <div className="callout green" style={{ margin: 0 }}><b>Xulosa (tajriba oxiri)</b>Tajriba guruhida yuqori daraja 7,8% → 20,6%, o‘rta daraja 21,1% → 59,2% ga oshdi, past daraja 71,1% → 20,2% ga kamaydi. Nazorat guruhida past daraja 60,8% bo‘lib qoldi — bu taklif etilgan modelning samaradorligini ko‘rsatadi.</div>
                    </div>
                </div>
            </section>

            <section className="section soft">
                <div className="container">
                    <h2 className="sec-title">Tavsiyalar</h2>
                    <p className="sec-lead">Tadqiqot natijalari asosida ishlab chiqilgan amaliy tavsiyalar</p>
                    <div className="grid grid-2">
                        {R.recommendations.map((t, i) => <div key={i} className="card" style={{ flexDirection: 'row', gap: 16 }}><span className="tile-icon" style={{ width: 46, height: 46, fontSize: 18, margin: 0, flexShrink: 0, fontFamily: 'var(--font-head)', fontWeight: 700 }}>{i + 1}</span><p className="mb-0">{t}</p></div>)}
                    </div>
                </div>
            </section>
        </>
    );
}
