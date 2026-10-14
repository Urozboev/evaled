/* Kodda saqlanadigan doimiy ma’lumotlar: sayt, tadqiqot, diagnostika, FAQ. */

export const SITE = {
    title: 'RAQAMLI TA’LIMDA BO‘LAJAK BOSHLANG‘ICH SINF O‘QITUVCHILARIDA TA’LIM JARAYONINI BAHOLASH KOMPETENSIYALARINI RIVOJLANTIRISH',
    brand: 'Raqamli baholash kompetensiyasi',
    org: 'Buxoro innovatsiyalar universiteti',
    dept: 'Pedagogika, psixologiya va sport kafedrasi',
    author: 'Samatova Muborak Kaxxorovna',
    authorRole: 'Pedagogika, psixologiya va sport kafedrasi o‘qituvchisi',
    supervisor: 'Nurumbekova Yarkinoy Anarmatovna',
    supervisorRole: 'pedagogika fanlari doktori (PhD)',
    specialty: '13.00.01 – Pedagogika nazariyasi. Pedagogik ta’limotlar tarixi',
    degree: 'Pedagogika fanlari bo‘yicha falsafa doktori (PhD)',
    year: 2025
};

export const LEVELS = { easy: 'Oson', medium: 'O‘rta', hard: 'Qiyin' } as const;
export const EXERCISE_TYPES = { classify: 'Tasniflash', match: 'Moslashtirish', order: 'Tartiblash', choice: 'Vaziyat tahlili', feedback: 'Teskari aloqa' } as const;
export const ROLES = { student: 'Talaba', teacher: 'O‘qituvchi', admin: 'Administrator' } as const;

export const PASS_SCORE = 70;
export const FINAL_COUNT = 20;
export const FINAL_MINUTES = 25;
export const LESSON_TEST_MINUTES = 8;
export const REQ_EXERCISES = 6;
export const REQ_SIMULATORS = 3;

export const DIAGNOSTIC = {
    components: {
        mot: { name: 'Motivatsion-qadriyat', icon: 'fa-heart' },
        cog: { name: 'Kognitiv-faollik', icon: 'fa-brain' },
        met: { name: 'Amaliy-metodik', icon: 'fa-screwdriver-wrench' },
        ref: { name: 'Refleksiv-baholash', icon: 'fa-rotate' }
    },
    items: [
        { c: 'mot', t: 'Baholashni o‘quvchini rivojlantirish vositasi deb bilaman, jazo yoki mukofot deb emas.' },
        { c: 'mot', t: 'Har bir o‘quvchini adolatli va xolis baholashga intilaman.' },
        { c: 'mot', t: 'Yangi raqamli baholash vositalarini o‘rganishga qiziqaman.' },
        { c: 'cog', t: 'Diagnostik, formativ va summativ baholash farqini aniq tushuntira olaman.' },
        { c: 'cog', t: 'Mezon, ko‘rsatkich va deskriptor tushunchalarini farqlay olaman.' },
        { c: 'cog', t: 'O‘zlashtirish darajalarini (reproduktiv, produktiv, ijodiy) bilaman.' },
        { c: 'met', t: 'Boshlang‘ich sinf topshirig‘i uchun analitik rubrika tuza olaman.' },
        { c: 'met', t: 'Google Forms yoki Wordwall’da avtomatik baholanadigan test yarata olaman.' },
        { c: 'met', t: 'O‘quvchi ishiga aniq va keyingi qadamni ko‘rsatuvchi teskari aloqa yoza olaman.' },
        { c: 'ref', t: 'Baholash natijalari asosida darsimni qayta rejalashtiraman.' },
        { c: 'ref', t: 'O‘z baholash amaliyotimdagi kamchiliklarni tahlil qila olaman.' },
        { c: 'ref', t: 'O‘quvchilarda o‘z-o‘zini baholash ko‘nikmasini shakllantira olaman.' }
    ] as { c: 'mot' | 'cog' | 'met' | 'ref'; t: string }[],
    scale: ['Mutlaqo qo‘shilmayman', 'Qo‘shilmayman', 'Qisman', 'Qo‘shilaman', 'To‘liq qo‘shilaman']
};

export function diagLevel(p: number) {
    return p > 75 ? { name: 'Yuqori', tone: 'green', kind: 'ijodiy' } : p > 50 ? { name: 'O‘rta', tone: 'amber', kind: 'samarali' } : { name: 'Quyi', tone: 'red', kind: 'reproduktiv' };
}

export const RESEARCH = {
    goal: 'Raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirish bo‘yicha tavsiyalar ishlab chiqish.',
    object: 'Raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirish jarayoni. Tajriba-sinov ishlariga Buxoro davlat pedagogika instituti, Andijon davlat pedagogika instituti va Guliston davlat universitetining jami 435 nafar talabasi jalb etilgan.',
    subject: 'Raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirishning shakl, metod va vositalari.',
    tasks: [
        'Raqamli ta’lim muhitida bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirishni ilmiy-pedagogik jihatdan asoslash, pedagogik va psixologik xususiyatlarini tahlil qilish.',
        'Bo‘lajak boshlang‘ich sinf o‘qituvchilarining o‘quv-bilish faoliyatini rivojlantirishning didaktik imkoniyatlarini aniqlash.',
        'Raqamli ta’lim muhitida bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirish modelini takomillashtirish.',
        'Bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirish samaradorligini aniqlash.'
    ],
    novelty: [
        'Baholash kompetensiyalarini rivojlantirish modeli pedagogik vaziyatlarga asoslangan integrativ ta’limning shaxsga yo‘naltirilganlik darajasini oshirish hamda xalqaro tajribalar asosida talabalar savodxonligi rivojlanganlik dinamikasini tatbiq qilish va baholash kompetensiyalari tushunchalarini adaptiv optimallashtirish asosida takomillashtirilgan.',
        'Ta’limni individuallashtirish va meta-predmetli texnologiyalar orqali o‘qituvchi va talabalar o‘rtasidagi sinxron va asinxron o‘zaro aloqa uchun gibrid ta’lim asosida raqamli ta’lim resurslarining pedagogik salohiyatini dinamik oshirish.',
        'Raqamli ta’lim muhitidagi faoliyatni hisobga olgan holda boshlang‘ich sinf o‘qituvchisining ko‘p tarmoqli metodik kompetentligining tuzilishi va mazmunli tarkibiy qismlari aniqlangan.',
        'Motivatsion-qadriyat, refleksiv-baholash, kognitiv-faollik komponentlari hamda gnostik, konstruktiv, kommunikativ va tashkiliy kompetensiyalarni shakllantirgan holda bo‘lajak o‘qituvchining pedagogik o‘zini o‘zi rivojlantirish natijasi takomillashtirilgan.'
    ],
    chapters: [
        { t: 'I bob. Raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida ta’lim jarayonini baholash kompetensiyalarini rivojlantirishning ilmiy-nazariy asoslari', p: ['1.1. Baholash kompetensiyalarini rivojlantirishning ijtimoiy-pedagogik zarurati', '1.2. Boshlang‘ich sinf o‘qituvchisining metodik kompetentligi tuzilishi va komponentlari', '1.3. Metodik kompetentlikni shakllantirishda OTM raqamli ta’lim muhitining o‘ziga xos xususiyatlari'] },
        { t: 'II bob. Raqamli ta’limda baholash kompetensiyalarini rivojlantirishning pedagogik asoslari', p: ['2.1. Baholash kompetensiyalarini rivojlantirish mazmuni', '2.2. Baholash kompetensiyalarini rivojlantirishning pedagogik modeli', '2.3. Kasbiy-pedagogik kompetensiyalarni baholash mezonlari va ko‘rsatkichlari'] },
        { t: 'III bob. Baholash kompetensiyalarini rivojlantirish samaradorligi', p: ['3.1. Tajriba-sinov ishlarini tashkil etish va o‘tkazish metodikasi', '3.2. Tajriba-sinov ishlari natijalari va statistik tahlili'] }
    ],
    stages: [
        { t: 'Aniqlovchi bosqich', d: 'Talabalarning baholash kompetensiyasi dastlabki darajasi aniqlandi; tajriba va nazorat guruhlari tanlandi.' },
        { t: 'Shakllantiruvchi bosqich', d: 'Meta-fan ta’lim texnologiyalari, “Flipped learning” va raqamli vositalar asosidagi model joriy etildi.' },
        { t: 'Yakunlovchi bosqich', d: 'Yakuniy diagnostika o‘tkazildi, natijalar matematik-statistik (χ²) tahlil qilindi.' }
    ],
    // [yuqori, o‘rta, past] %
    results: {
        before: {
            groups: [
                { uni: 'Buxoro DPI', exp: [8.5, 21.1, 70.4], ctl: [7.2, 23.2, 69.6], n: [71, 69] },
                { uni: 'Andijon DPI', exp: [8.1, 23.0, 68.9], ctl: [7.9, 23.7, 68.4], n: [74, 76] },
                { uni: 'Guliston DU', exp: [6.8, 19.2, 74.0], ctl: [6.9, 19.4, 73.6], n: [73, 72] }
            ],
            total: { exp: [7.8, 21.1, 71.1], ctl: [7.4, 22.1, 70.5] }
        },
        after: {
            groups: [
                { uni: 'Buxoro DPI', exp: [21.1, 62.0, 16.9], ctl: [10.1, 30.4, 59.4], n: [71, 69] },
                { uni: 'Andijon DPI', exp: [21.6, 58.1, 20.3], ctl: [10.5, 28.9, 60.5], n: [74, 76] },
                { uni: 'Guliston DU', exp: [19.2, 57.5, 23.3], ctl: [9.7, 27.8, 62.5], n: [73, 72] }
            ],
            total: { exp: [20.6, 59.2, 20.2], ctl: [10.1, 29.0, 60.8] }
        }
    },
    recommendations: [
        'Moodle, Google Classroom, Edmodo, Microsoft Teams kabi raqamli ta’lim platformalarida baholash turlarini qo‘llash, avtomatik testlar va interaktiv viktorinalar orqali baholashni tashkil etish.',
        'Bo‘lajak boshlang‘ich sinf o‘qituvchilarining bilim, ko‘nikma va malakalarini baholash mezonlarini aniq belgilash va reproduktiv, produktiv, qisman izlanuvchan va kreativ darajalar bo‘yicha baholashni raqamli muhitda tashkil etish.',
        'Formativ va summativ baholash usullarini uyg‘unlashtirish: formativ baholashda “peer assessment” va “self-assessment” imkoniyatlarini yo‘lga qo‘yish, summativ baholashda test, esse, taqdimot va virtual loyihalardan foydalanish.',
        'Bilimlarni videodarslar, podkastlar va simulyatorlar asosida tayyorlangan onlayn mashqlar orqali baholash.',
        '“Digital Assessment Tools” mavzusida maxsus seminar-treninglar tashkil etish.'
    ]
};

export const DOCS = [
    ['O‘RQ-637', '2020-yil 23-sentyabr', '“Ta’lim to‘g‘risida”gi O‘zbekiston Respublikasi Qonuni'],
    ['PF-5847', '2019-yil 8-oktyabr', 'O‘zbekiston Respublikasi oliy ta’lim tizimini 2030-yilgacha rivojlantirish konsepsiyasini tasdiqlash to‘g‘risida'],
    ['PF-1059', '2019-yil 31-dekabr', 'Uzluksiz ma’naviy tarbiya konsepsiyasini tasdiqlash va uni amalga oshirish chora-tadbirlari to‘g‘risida'],
    ['PF-60', '2022-yil 28-yanvar', '2022–2026-yillarga mo‘ljallangan Yangi O‘zbekistonning taraqqiyot strategiyasi to‘g‘risida'],
    ['PQ-4623', '', 'Pedagogik ta’lim sohasini yanada rivojlantirish chora-tadbirlari to‘g‘risida'],
    ['Incheon declaration', '2015', 'Ta’lim – 2030: inklyuziv va sifatli ta’lim hamda umrbod ta’lim (Xalqaro ta’lim forumi, Janubiy Koreya)']
] as const;

export const METHODS = [
    ['fa-traffic-light', 'Svetofor', 'Yashil–sariq–qizil kartochkalar bilan tushunish darajasini bildirish.'],
    ['fa-ticket', 'Chiqish chiptasi', 'Dars oxirida 1–3 savolga qisqa yozma javob.'],
    ['fa-thumbs-up', 'Bosh barmoq', 'Yuqoriga / yon / pastga – tezkor tushunish tekshiruvi.'],
    ['fa-chalkboard', 'Mini doska', 'Barcha o‘quvchi javobini bir vaqtda ko‘rsatish.'],
    ['fa-star', 'Ikki yulduz – bitta tilak', 'O‘zaro baholashda ikki yutuq va bitta taklif.'],
    ['fa-stairs', 'Bilim zinapoyasi', 'O‘quvchi o‘zini qaysi pog‘onada his qilishini belgilaydi.'],
    ['fa-diagram-project', 'Klaster', 'Tushunchalar o‘rtasidagi bog‘liqlikni vizual tasvirlash.'],
    ['fa-basket-shopping', '“G‘oyalar savati”', 'Mavzu bo‘yicha bilganlarini jamlash va tahlil qilish.'],
    ['fa-folder-open', 'Portfolio', 'O‘quvchi ishlari to‘plami orqali rivojlanish dinamikasini ko‘rish.'],
    ['fa-eye', 'Kuzatuv varaqasi', 'Guruh ishida har bir o‘quvchi faolligini mezonlar asosida qayd etish.']
] as const;

export const FAQ = [
    { q: 'Platformadan qanday foydalanaman?', a: 'Ro‘yxatdan o‘ting va “Mening sahifam”dagi qadamlarni ketma-ket bajaring: diagnostika → darslar → mashqlar → simulyatorlar → yakuniy test → sertifikat. Har doim “Davom ettirish” tugmasi keyingi qadamga olib boradi.' },
    { q: 'Natijalarim qayerda saqlanadi?', a: 'Barcha natijalar akkauntingizga bog‘langan holda serverda saqlanadi. Istalgan qurilmadan kirib davom ettirishingiz mumkin.' },
    { q: 'Guruh kodi nima?', a: 'O‘qituvchingiz bergan 6 belgili kod. Uni ro‘yxatdan o‘tishda yoki “Profil” sahifasida kiritsangiz, o‘qituvchi natijalaringizni ko‘ra oladi.' },
    { q: 'Sertifikat olish shartlari qanday?', a: 'Barcha darslarni o‘qib chiqish, yakuniy testdan kamida 70% to‘plash, kamida 6 ta amaliy mashq va 3 ta simulyatorni bajarish lozim.' },
    { q: 'Testni qayta topshirsa bo‘ladimi?', a: 'Ha, cheklovsiz. Hisobda eng yaxshi natijangiz olinadi.' },
    { q: 'Parolimni unutdim, nima qilaman?', a: '“Parolni unutdingizmi?” havolasidan foydalaning. Agar xat kelmasa, o‘qituvchingiz yoki administratorga murojaat qiling — ular yangi vaqtinchalik parol o‘rnatib beradi.' }
];
