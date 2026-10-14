import Link from 'next/link';
import { NetBg } from '@/components/ui';
import { getCurrentUser } from '@/lib/auth';
import { SITE } from '@/lib/content';

const TILES = [
    ['/lessons', 'fa-book-open', 'Nazariy darslar', 'Dissertatsiya boblari asosidagi 8 ta modul'],
    ['/diagnostics', 'fa-stethoscope', 'Diagnostika', 'Kompetensiya darajangizni aniqlang'],
    ['/tests', 'fa-list-check', 'Testlar', 'Mavzu testlari va yakuniy test'],
    ['/exercises', 'fa-puzzle-piece', 'Amaliy mashqlar', 'Tasniflash, keys, teskari aloqa'],
    ['/simulators', 'fa-children', 'Baholash simulyatori', 'Virtual boshlang‘ich sinf o‘quvchilari'],
    ['/tools', 'fa-laptop-code', 'Raqamli vositalar', 'Wordwall, Mentimeter, Google Forms…'],
    ['/resources', 'fa-book-bookmark', 'Glossariy va hujjatlar', 'Atamalar, me’yoriy hujjatlar, shablonlar'],
    ['/certificate', 'fa-award', 'Sertifikat', 'Kursni tamomlaganlik sertifikati']
];

export default async function Home() {
    const user = await getCurrentUser();
    return (
        <>
            <section className="hero">
                <NetBg seed={11} />
                <div className="container">
                    <div className="eyebrow">Bo‘lajak boshlang‘ich sinf o‘qituvchilari uchun o‘quv-metodik platforma</div>
                    <h1>{SITE.title}</h1>
                    <div className="hero-sub">Nazariya · Test · Amaliyot · Simulyatsiya</div>
                    <div className="btn-row" style={{ justifyContent: 'center' }}>
                        {user ? (
                            <Link href="/dashboard" className="btn btn-white" style={{ height: 54, padding: '0 30px', borderRadius: 30 }}><i className="fas fa-play" />Davom ettirish</Link>
                        ) : (
                            <>
                                <Link href="/register" className="btn btn-white" style={{ height: 54, padding: '0 30px', borderRadius: 30 }}><i className="fas fa-user-plus" />Bepul ro‘yxatdan o‘tish</Link>
                                <Link href="/login" className="btn btn-ghost-white" style={{ height: 54, padding: '0 30px', borderRadius: 30 }}>Kirish</Link>
                            </>
                        )}
                    </div>
                    <div className="hero-meta">
                        <span><i className="fas fa-book" />8 ta nazariy dars</span>
                        <span><i className="fas fa-circle-question" />48 ta test savoli</span>
                        <span><i className="fas fa-puzzle-piece" />9 ta amaliy mashq</span>
                        <span><i className="fas fa-children" />5 ta virtual sinf</span>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="sec-title">Qanday ishlaydi?</h2>
                    <p className="sec-lead">Uch oddiy qadam — tizim har doim keyingi qadamni o‘zi ko‘rsatib turadi</p>
                    <div className="steps">
                        <div className="step"><h4><i className="fas fa-user-plus" style={{ color: 'var(--primary)' }} /> Ro‘yxatdan o‘ting</h4><p>Ism, e-pochta va parol — bir daqiqa. O‘qituvchingiz guruh kodini bergan bo‘lsa, uni ham kiriting.</p></div>
                        <div className="step"><h4><i className="fas fa-route" style={{ color: 'var(--primary)' }} /> Qadamlarni bajaring</h4><p>Diagnostika → darslar → mashqlar → simulyatorlar → yakuniy test. “Davom ettirish” tugmasi doim keyingi ishni ochadi.</p></div>
                        <div className="step"><h4><i className="fas fa-award" style={{ color: 'var(--primary)' }} /> Sertifikat oling</h4><p>Natijalaringiz saqlanadi. Talablar bajarilgach, raqamli tekshiriladigan sertifikat beriladi.</p></div>
                    </div>
                </div>
            </section>

            <section className="section soft">
                <div className="container">
                    <h2 className="sec-title">Platforma bo‘limlari</h2>
                    <p className="sec-lead">Baholash kompetensiyasini rivojlantirish uchun barcha resurslar bir joyda</p>
                    <div className="tiles">
                        {TILES.map(([href, icon, t, d]) => (
                            <Link key={href} className="tile" href={href}><span className="tile-icon"><i className={`fas ${icon}`} /></span><h3>{t}</h3><p>{d}</p></Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="sec-title">Baholash kompetensiyasini rivojlantirish modeli</h2>
                    <p className="sec-lead">Raqamli ta’lim muhitida bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirishning pedagogik modeli</p>
                    <div className="model">
                        <div className="model-col">
                            <h4><i className="fas fa-compass" />Yondashuvlar</h4>
                            <ul><li>Shaxsga yo‘naltirilgan</li><li>Faoliyatga asoslangan</li><li>Kompetensiyaviy</li><li>Integratsiyalashgan o‘qitish</li></ul>
                            <h4 className="mt-2"><i className="fas fa-scale-balanced" />Tamoyillar</h4>
                            <ul><li>Tizimlilik, ilmiylik, uzviylik</li><li>Ko‘rgazmalilik, onglilik, faollik</li><li>Muammolilik, amaliyotga yo‘naltirilganlik</li><li>Maqsadlilik, axloqiy-etik</li></ul>
                        </div>
                        <div className="model-col">
                            <h4><i className="fas fa-layer-group" />Komponentlar</h4>
                            <ul><li>Motivatsion-qadriyat</li><li>Kognitiv-faollik</li><li>Amaliy-metodik</li><li>Refleksiv-baholash</li></ul>
                            <h4 className="mt-2"><i className="fas fa-lightbulb" />Meta-fan texnologiyalar</h4>
                            <ul><li>Loyiha faoliyati</li><li>Tanqidiy fikrlash, muammoli ta’lim</li><li>Simulyatsiya, “case”</li><li>Hamkorlikda o‘qitish, Flipped learning</li></ul>
                        </div>
                        <div className="model-col">
                            <h4><i className="fas fa-users-gear" />Ish shakllari</h4>
                            <ul><li>Mustaqil individual ish</li><li>Kichik guruhlarda ishlash</li><li>Jamoaviy ishlar</li></ul>
                            <h4 className="mt-2"><i className="fas fa-stairs" />Mezon va darajalar</h4>
                            <ul><li>Mezonlar: reproduktiv, samarali (produktiv), ijodiy</li><li>Darajalar: yuqori, o‘rta, quyi</li></ul>
                        </div>
                    </div>
                    <div className="model-result">
                        <i className="fas fa-user-check" />
                        <div><h4>Natija</h4><p>Raqamli ta’lim muhitida ta’lim jarayonini baholash kompetensiyasi rivojlangan boshlang‘ich sinf o‘qituvchisi</p></div>
                    </div>
                </div>
            </section>

            <section className="stats-band">
                <div className="container stats">
                    <div className="stat"><b>435</b><span>tajriba-sinovdagi talabalar</span></div>
                    <div className="stat"><b>3</b><span>oliy ta’lim muassasasi</span></div>
                    <div className="stat"><b>7,8% → 20,6%</b><span>yuqori daraja (tajriba guruhi)</span></div>
                    <div className="stat"><b>71,1% → 20,2%</b><span>past daraja (tajriba guruhi)</span></div>
                </div>
            </section>

            <section className="section tight" style={{ padding: '56px 0 72px' }}>
                <div className="container">
                    <div className="cta">
                        <NetBg seed={5} />
                        <div style={{ position: 'relative' }}>
                            <h2>{user ? 'O‘qishni davom ettiring' : 'Bugunoq boshlang'}</h2>
                            <p>{user ? 'Keyingi qadamingiz “Mening sahifam”da kutmoqda.' : 'Ro‘yxatdan o‘ting — natijalaringiz saqlanadi, o‘qituvchingiz esa o‘sishingizni kuzatib boradi.'}</p>
                        </div>
                        <div className="btn-row" style={{ position: 'relative' }}>
                            <Link href={user ? '/dashboard' : '/register'} className="btn btn-white">{user ? 'Mening sahifam' : 'Ro‘yxatdan o‘tish'}</Link>
                            <Link href="/about" className="btn btn-ghost-white">Tadqiqot haqida</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
