/* Boshlang‘ich darslar (Markdown). Admin paneldan tahrirlanadi. */
export type SeedQuestion = { q: string; o: string[]; a: number; e: string };
export type SeedLesson = {
    chapter: string; icon: string; duration: number; title: string; summary: string;
    goals: string[]; content: string; terms: string[]; review: string[]; questions: SeedQuestion[];
};

export const SEED_LESSONS: SeedLesson[] = [
{
    chapter: 'I bob', icon: 'fa-compass', duration: 20,
    title: 'Raqamli ta’limda baholash kompetensiyasi: mohiyati va zarurati',
    summary: 'Baholash kompetensiyasi tushunchasi, uning raqamli ta’lim sharoitidagi ijtimoiy-pedagogik zarurati va me’yoriy asoslari.',
    goals: ['“Baholash kompetensiyasi” tushunchasining mazmunini izohlay olish', 'Raqamli ta’limda baholashga qo‘yiladigan yangi talablarni aniqlash', 'Tadqiqot zaruriyatini belgilovchi me’yoriy-huquqiy hujjatlarni bilish'],
    content: `## Baholash kompetensiyasi nima?

**Ta’lim jarayonini baholash kompetensiyasi** – bu o‘qituvchining o‘quvchilar bilim, ko‘nikma va malakalarini tizimli baholashi; baholash mezonlari va usullarini to‘g‘ri tanlashi; o‘quvchilar rivojlanishini kuzatish va tahlil qilishi hamda natijalarga asoslangan refleksiya olib borish qobiliyatidir.

> [!NOTE] Asosiy g‘oya
> Zamonaviy ta’limda baho – bu “hukm” emas, balki o‘quvchining keyingi qadamini belgilab beruvchi ma’lumot manbai. Kompetensiyaviy yondashuv bilimni emas, **natijani** baholash imkonini beradi.

## Nima uchun aynan hozir dolzarb?

Jahon ta’lim tizimida o‘quv-bilish faoliyatini uzluksiz takomillashtirish mexanizmlari joriy etilmoqda. Janubiy Koreyada o‘tkazilgan Xalqaro ta’lim forumida qabul qilingan **«Incheon declaration»** (2030-yilgacha) ta’limni barqaror rivojlanishning asosiy harakatlantiruvchi kuchi sifatida e’tirof etdi.

Raqamli ta’lim muhiti baholash jarayoniga quyidagi o‘zgarishlarni olib kirdi:

- avtomatlashtirilgan testlar va interaktiv viktorinalar orqali **tezkor teskari aloqa**;
- o‘quvchi natijalarini elektron jurnal va platformalarda **uzluksiz kuzatish**;
- portfolio, loyiha, taqdimot kabi **muqobil baholash** shakllarining kengayishi;
- o‘qituvchidan yangi raqamli savodxonlik va ma’lumotlarni tahlil qilish ko‘nikmasining talab etilishi.

## Me’yoriy-huquqiy asoslar

| Hujjat | Mazmuni |
|---|---|
| O‘RQ-637 | “Ta’lim to‘g‘risida”gi Qonun (2020-yil 23-sentyabr) |
| PF-5847 | Oliy ta’lim tizimini 2030-yilgacha rivojlantirish konsepsiyasi (2019-yil 8-oktyabr) |
| PF-1059 | Uzluksiz ma’naviy tarbiya konsepsiyasi (2019-yil 31-dekabr) |
| PF-60 | 2022–2026-yillarga mo‘ljallangan Yangi O‘zbekistonning taraqqiyot strategiyasi (2022-yil 28-yanvar) |
| PQ-4623 | Pedagogik ta’lim sohasini yanada rivojlantirish chora-tadbirlari to‘g‘risida |

## Oliy ta’limning davlat ta’lim standarti (DTS)

DTS – oliy ta’lim muassasalarida ta’limning mazmuni, sifati va natijalarini belgilab beradigan huquqiy-me’yoriy hujjat. U ta’lim dasturlarini o‘zlashtirish natijalariga, dastur tuzilishiga va uni amalga oshirish shartlariga qo‘yiladigan talablarni o‘z ichiga oladi.

1. Umummilliy ta’lim maqsadlariga mos ravishda mutaxassis tayyorlash imkonini yaratadi.
2. Talabalar olgan bilim va ko‘nikmalarning standartga muvofiqligini ta’minlaydi.
3. Har bir fan natijasida shakllanadigan kompetensiyalarni aniq belgilaydi – bu bilim emas, **natijaga qarab baholash** imkonini beradi.

> [!TIP] Amaliy xulosa
> Bo‘lajak boshlang‘ich sinf o‘qituvchisi baholashni faqat “baho qo‘yish” sifatida emas, balki o‘quv jarayonini boshqarish vositasi sifatida tushunishi kerak.`,
    terms: ['Kompetensiya', 'Baholash kompetensiyasi', 'Raqamli ta’lim muhiti', 'DTS', 'Kompetensiyaviy yondashuv'],
    review: ['Baholash kompetensiyasi qanday qobiliyatlarni o‘z ichiga oladi?', 'Raqamli ta’lim baholash jarayoniga qanday yangiliklar olib kirdi?', 'DTS baholashga qanday talablar qo‘yadi?'],
    questions: [
        { q: 'Ta’lim jarayonini baholash kompetensiyasi deganda nima tushuniladi?', o: ['O‘quvchilarga faqat baho qo‘yish ko‘nikmasi', 'Bilim va ko‘nikmalarni tizimli baholash, mezon va usullarni tanlash, rivojlanishni kuzatish va refleksiya qilish qobiliyati', 'Elektron jurnalni yuritish', 'Test savollarini yodlash'], a: 1, e: 'Baholash kompetensiyasi tizimli baholash, mezon va usullarni tanlash, kuzatish-tahlil va refleksiyani o‘z ichiga oladi.' },
        { q: '«Incheon declaration» qaysi davrgacha ta’lim maqsadlarini belgilaydi?', o: ['2025-yilgacha', '2030-yilgacha', '2040-yilgacha', '2050-yilgacha'], a: 1, e: 'Incheon deklaratsiyasi 2030-yilgacha bo‘lgan ta’lim kun tartibini belgilaydi.' },
        { q: '“Ta’lim to‘g‘risida”gi Qonun raqami qaysi?', o: ['PF-60', 'PQ-4623', 'O‘RQ-637', 'PF-5847'], a: 2, e: 'O‘RQ-637 – 2020-yil 23-sentyabrda imzolangan “Ta’lim to‘g‘risida”gi Qonun.' },
        { q: 'Kompetensiyaviy yondashuv baholashda nimaga urg‘u beradi?', o: ['Yodlangan faktlar soniga', 'Natija va amalda qo‘llay olishga', 'Faqat davomatga', 'O‘quvchining xulqiga'], a: 1, e: 'DTS kompetensiyalarni aniq belgilaydi va bilim emas, natijaga qarab baholash imkonini beradi.' },
        { q: 'Quyidagilardan qaysi biri raqamli ta’limning baholashga olib kirgan yangiligi EMAS?', o: ['Tezkor avtomatik teskari aloqa', 'Natijalarni uzluksiz kuzatish', 'Faqat og‘zaki so‘rov', 'Muqobil baholash shakllari (portfolio, loyiha)'], a: 2, e: 'Faqat og‘zaki so‘rov an’anaviy usul; raqamli muhit baholash shakllarini kengaytiradi.' },
        { q: 'PF-60 farmoni nima haqida?', o: ['Yangi O‘zbekistonning 2022–2026-yillarga mo‘ljallangan taraqqiyot strategiyasi', 'Maktabgacha ta’lim konsepsiyasi', 'Oliy ta’limni 2030-yilgacha rivojlantirish konsepsiyasi', 'Ma’naviy tarbiya konsepsiyasi'], a: 0, e: 'PF-60 (2022-yil 28-yanvar) – Yangi O‘zbekistonning taraqqiyot strategiyasi.' }
    ]
},
{
    chapter: 'I bob', icon: 'fa-layer-group', duration: 25,
    title: 'Boshlang‘ich sinf o‘qituvchisi kompetentligining tuzilishi va komponentlari',
    summary: 'Kasbiy va metodik kompetentlik tarkibi bo‘yicha olimlar qarashlari, baholash kompetensiyasining komponentlari.',
    goals: ['Kasbiy kompetentlik tarkibi bo‘yicha turli yondashuvlarni qiyoslash', 'Baholash kompetensiyasining 4 ta komponentini ajrata olish', 'Gnostik, konstruktiv, kommunikativ va tashkiliy kompetensiyalarni farqlash'],
    content: `## Olimlarning qarashlari

O‘qituvchining kasbiy kompetentligi tarkibi bo‘yicha O‘zbekistonlik va xorijiy olimlar turlicha yondashuvlarni ilgari surgan:

| Muallif | Kompetentlik tarkibi |
|---|---|
| N.A. Muslimov | Ta’limiy-metodik, psixologik-pedagogik, tadqiqotchilik, axborot-kommunikatsiya, madaniy va axloqiy kompetensiyalar |
| O. Qo‘ysinov | Pedagogik bilimlar, amaliy ko‘nikmalar, kasbiy harakat va xulq-atvor, kommunikativ qobiliyatlar |
| A.J. Alimov | Pedagogik texnologiyalarni bilish, AKT kompetensiyasi, axloqiy-etik kompetensiya, ijodiy va tadqiqotchilik salohiyati |
| N.R. Rahimqulov | Bilim (nazariy tayyorgarlik), amaliy faoliyat (metodika), innovatsion qobiliyatlar, muloqot va hamkorlik |
| Yu.G. Tatur | Kognitiv, motivatsion-qiymat, operatsion-faoliyat va ijtimoiy-psixologik komponentlar |
| M.Q. To‘xtamurodova | Refleksiv, ta’limiy (metodik), ijtimoiy-kommunikativ, ijodiy-innovatsion, shaxsiy va axloqiy kompetensiyalar |

## Baholash kompetensiyasining komponentlari

Tadqiqotda raqamli ta’limda bo‘lajak boshlang‘ich sinf o‘qituvchilarida baholash kompetensiyasining quyidagi o‘zaro bog‘liq komponentlari ajratilgan:

| Komponent | Mazmuni | Namoyon bo‘lishi |
|---|---|---|
| **Motivatsion-qadriyat** | Baholashga qadriyat sifatida munosabat, adolatli baholashga intilish | O‘quvchi muvaffaqiyatini rag‘batlantirishga ichki ehtiyoj |
| **Kognitiv-faollik** | Baholash turlari, mezonlari, usullari haqidagi bilimlar | Formativ va summativ baholashni to‘g‘ri tanlash |
| **Amaliy-metodik** | Rubrika tuzish, topshiriq yaratish, raqamli vositalarni qo‘llash | Google Forms, Wordwall kabi vositalarda test yaratish |
| **Refleksiv-baholash** | O‘z faoliyatini tahlil qilish va takomillashtirish | Baholash natijalari asosida darsni qayta rejalashtirish |

## Faoliyatga oid kompetensiyalar

- **Gnostik** – o‘quvchini, o‘quv materialini va o‘z faoliyatini o‘rganish, tahlil qilish;
- **Konstruktiv** – dars, topshiriq va baholash vositalarini loyihalash;
- **Kommunikativ** – o‘quvchi va ota-onalarga teskari aloqani to‘g‘ri yetkazish;
- **Tashkiliy** – baholash jarayonini (vaqt, shakl, ishtirokchilar) tashkil etish.

## 60110500 – Boshlang‘ich ta’lim yo‘nalishidagi kasbiy kompetentliklar

1. Turli yosh davrlarida inson xulq-atvori va faoliyatini boshqarish, psixik rivojlanish qonuniyatlarini hisobga olish qobiliyati.
2. O‘quv-tarbiya jarayonini modellashtirish va uni amaliyotga tatbiq etish.
3. Ta’lim jarayoni sub’ektlarining hamkorlikdagi faoliyatini tashkil etish usullarini egallaganlik.
4. Psixologik-pedagogik tadqiqotlarning miqdor va sifat metodlarini, bolalar rivojlanishini tashxis etish metodlarini egallaganlik.`,
    terms: ['Metodik kompetentlik', 'Motivatsion-qadriyat komponenti', 'Refleksiya', 'Gnostik kompetensiya', 'Konstruktiv kompetensiya'],
    review: ['Baholash kompetensiyasining qaysi komponentlarini bilasiz?', 'Gnostik va konstruktiv kompetensiyalarning farqi nimada?', 'Yu.G. Tatur kompetentlik tarkibiga qaysi komponentlarni kiritgan?'],
    questions: [
        { q: 'Yu.G. Tatur kompetentlik tarkibiga qaysi komponentlarni kiritgan?', o: ['Kognitiv, motivatsion-qiymat, operatsion-faoliyat, ijtimoiy-psixologik', 'Faqat bilim va ko‘nikma', 'Gnostik va tashkiliy', 'Madaniy va axloqiy'], a: 0, e: 'Tatur to‘rt komponentni ajratgan: kognitiv, motivatsion-qiymat, operatsion-faoliyat, ijtimoiy-psixologik.' },
        { q: 'Baholash vositalarini (topshiriq, rubrika) loyihalash qaysi kompetensiyaga tegishli?', o: ['Gnostik', 'Konstruktiv', 'Kommunikativ', 'Tashkiliy'], a: 1, e: 'Konstruktiv kompetensiya – dars va baholash vositalarini loyihalash.' },
        { q: 'O‘qituvchining o‘z baholash faoliyatini tahlil qilib, takomillashtirishi qaysi komponentga kiradi?', o: ['Motivatsion-qadriyat', 'Kognitiv-faollik', 'Refleksiv-baholash', 'Amaliy-metodik'], a: 2, e: 'Refleksiv-baholash komponenti o‘z faoliyatini tahlil va takomillashtirishni nazarda tutadi.' },
        { q: 'O‘quvchi va ota-onaga teskari aloqani to‘g‘ri yetkazish qaysi kompetensiya?', o: ['Kommunikativ', 'Gnostik', 'Konstruktiv', 'Tashkiliy'], a: 0, e: 'Kommunikativ kompetensiya – muloqot va teskari aloqani samarali yetkazish.' },
        { q: 'Boshlang‘ich ta’lim bakalavriat yo‘nalishining shifri qaysi?', o: ['60110100', '60110500', '60111200', '60112300'], a: 1, e: '60110500 – Boshlang‘ich ta’lim bakalavr ta’lim yo‘nalishi.' },
        { q: 'Adolatli baholashga intilish va o‘quvchi muvaffaqiyatini rag‘batlantirishga ichki ehtiyoj qaysi komponentda namoyon bo‘ladi?', o: ['Amaliy-metodik', 'Motivatsion-qadriyat', 'Kognitiv-faollik', 'Tashkiliy'], a: 1, e: 'Bu motivatsion-qadriyat komponentining belgilari.' }
    ]
},
{
    chapter: 'II bob', icon: 'fa-arrows-rotate', duration: 25,
    title: 'Formativ va summativ baholash',
    summary: 'Baholash turlari, ularning maqsadi, vaqti va boshlang‘ich sinfdagi qo‘llanilishi. Diagnostik, formativ va summativ baholash uyg‘unligi.',
    goals: ['Diagnostik, formativ va summativ baholashni farqlash', 'Har bir baholash turi uchun mos usul va vositani tanlash', 'Formativ baholash siklini amalda qo‘llash'],
    content: `## Baholashning uch turi

| Mezon | Diagnostik | Formativ (shakllantiruvchi) | Summativ (yakuniy) |
|---|---|---|---|
| Savol | “O‘quvchi nimani biladi?” | “O‘quvchi qanday o‘rganmoqda?” | “O‘quvchi nimani o‘rgandi?” |
| Vaqti | Mavzu/kurs boshida | O‘quv jarayoni davomida | Bo‘lim, chorak, yil yakunida |
| Maqsadi | Boshlang‘ich darajani aniqlash | O‘rganishni yaxshilash, teskari aloqa | Natijani qayd etish, baho qo‘yish |
| Usullar | Kirish testi, suhbat | Kuzatuv, “chiqish chiptasi”, svetofor, o‘z-o‘zini baholash | Nazorat ishi, test, loyiha himoyasi |
| Raqamli vosita | Google Forms | Mentimeter, Plickers, Wordwall | Moodle testi, Google Forms (avtobaholash) |

> [!NOTE] Esda tuting
> Formativ baholash – “o‘rganish *uchun* baholash”, summativ baholash – “o‘rganilganni baholash”. Ular bir-birini inkor etmaydi, balki uyg‘unlashtiriladi.

## Formativ baholash sikli

1. **O‘quv maqsadini aniqlash** va uni o‘quvchiga tushunarli tilda yetkazish.
2. **Muvaffaqiyat mezonlarini** birgalikda belgilash (“Men buni qila olsam, maqsadga erishgan bo‘laman”).
3. **Dalil to‘plash** – savol-javob, kuzatuv, mini-topshiriq, raqamli so‘rovnoma.
4. **Teskari aloqa berish** – aniq, o‘z vaqtida, keyingi qadamni ko‘rsatuvchi.
5. **O‘qitishni moslashtirish** – natijaga ko‘ra tushuntirish, guruhlash yoki topshiriqni o‘zgartirish.

## Boshlang‘ich sinf uchun formativ usullar

- **Svetofor** – yashil (tushundim), sariq (qisman), qizil (yordam kerak) kartochkalar;
- **Chiqish chiptasi** – dars oxirida 1–2 savolga qisqa javob;
- **Bosh barmoq** – tezkor tushunish tekshiruvi;
- **Ikki yulduz va bitta tilak** – o‘zaro baholashda ikki yutuq va bitta taklif;
- **Mini doska** – barcha o‘quvchi javobini bir vaqtda ko‘rsatadi.

## Uyg‘unlashtirish tavsiyasi

Tadqiqot tavsiyasiga ko‘ra, formativ baholashda **peer assessment** (o‘zaro baholash) va **self-assessment** (o‘z-o‘zini baholash) imkoniyatlari yo‘lga qo‘yilishi, summativ baholashda esa test, esse, taqdimot va virtual loyihalardan foydalanish maqsadga muvofiq.`,
    terms: ['Diagnostik baholash', 'Formativ baholash', 'Summativ baholash', 'Muvaffaqiyat mezoni', 'Chiqish chiptasi'],
    review: ['Formativ baholashning summativ baholashdan asosiy farqi nimada?', 'Formativ baholash sikli qaysi bosqichlardan iborat?', 'Boshlang‘ich sinfda qo‘llash mumkin bo‘lgan 3 ta formativ usulni ayting.'],
    questions: [
        { q: 'Formativ baholashning asosiy maqsadi nima?', o: ['O‘quvchilarni reytingga solish', 'O‘quv jarayonini yaxshilash va o‘rganishga yordam berish', 'Chorak bahosini chiqarish', 'Maktab reytingini oshirish'], a: 1, e: 'Formativ baholash – “o‘rganish uchun baholash”, maqsadi jarayonni yaxshilash.' },
        { q: 'Chorak yakunidagi nazorat ishi qaysi baholash turiga kiradi?', o: ['Diagnostik', 'Formativ', 'Summativ', 'O‘z-o‘zini baholash'], a: 2, e: 'Bo‘lim, chorak yakunidagi nazorat summativ (yakuniy) baholashdir.' },
        { q: 'Yangi mavzu boshida o‘quvchilarning boshlang‘ich bilimini aniqlash uchun qaysi baholash qo‘llaniladi?', o: ['Diagnostik', 'Summativ', 'Yakuniy attestatsiya', 'Reyting'], a: 0, e: 'Diagnostik baholash boshlang‘ich darajani aniqlaydi.' },
        { q: '“Svetofor” usuli qaysi baholash turiga xos?', o: ['Summativ', 'Formativ', 'Davlat attestatsiyasi', 'Tashqi baholash'], a: 1, e: 'Svetofor – darsda tushunishni tezkor tekshiruvchi formativ usul.' },
        { q: 'Formativ baholash siklida “dalil to‘plash”dan keyin qaysi bosqich keladi?', o: ['O‘quv maqsadini aniqlash', 'Teskari aloqa berish', 'Chorak bahosini chiqarish', 'Muvaffaqiyat mezonlarini belgilash'], a: 1, e: 'Sikl: maqsad → mezon → dalil → teskari aloqa → o‘qitishni moslashtirish.' },
        { q: 'Tadqiqot tavsiyasiga ko‘ra formativ baholashda qaysi imkoniyatlar yo‘lga qo‘yilishi kerak?', o: ['Faqat yakuniy test', 'Peer assessment va self-assessment', 'Faqat og‘zaki so‘rov', 'Faqat uy vazifasi'], a: 1, e: 'O‘zaro (peer) va o‘z-o‘zini (self) baholash formativ baholashni kuchaytiradi.' }
    ]
},
{
    chapter: 'II bob', icon: 'fa-table-cells', duration: 30,
    title: 'Baholash mezonlari, darajalari va rubrikalar',
    summary: 'Mezon va ko‘rsatkich tushunchalari, reproduktiv–produktiv–ijodiy darajalar, analitik va holistik rubrika tuzish.',
    goals: ['Mezon, ko‘rsatkich va deskriptorni farqlash', 'Bilimni reproduktiv, produktiv (samarali) va ijodiy darajalar bo‘yicha baholash', 'Boshlang‘ich sinf topshirig‘i uchun analitik rubrika tuzish'],
    content: `## Mezon, ko‘rsatkich, deskriptor

- **Mezon** – nima baholanadi (masalan, “matn mazmunini tushunish”);
- **Ko‘rsatkich** – mezonning kuzatiladigan belgisi (masalan, “asosiy fikrni o‘z so‘zi bilan aytadi”);
- **Deskriptor** – har bir daraja uchun aniq tavsif (“asosiy fikrni ikki va undan ortiq dalil bilan asoslaydi”).

## O‘zlashtirish darajalari

| Daraja | Tavsif | Topshiriq namunasi (3-sinf) |
|---|---|---|
| **Reproduktiv** | Bilimni eslab qolish va namunaga ko‘ra qayta tiklash | “Ko‘paytirish jadvalini yoddan ayt.” |
| **Produktiv (samarali)** | Bilimni tanish vaziyatda qo‘llash, tahlil qilish | “Do‘kondagi xaridning umumiy narxini hisobla.” |
| **Qisman izlanuvchan** | Yangi vaziyatda yordam bilan yechim topish | “Masalani ikki xil usulda yech.” |
| **Ijodiy (kreativ)** | Yangi mahsulot yaratish, mustaqil muammo qo‘yish | “Ko‘paytirishga oid o‘z masalangni tuz.” |

Tadqiqotda baholash darajalari **yuqori, o‘rta va quyi** sifatida belgilanib, natijalar shu darajalar bo‘yicha taqqoslangan.

## Rubrika turlari

**Holistik rubrika** ishni yaxlit baholaydi (tez, lekin kam ma’lumot beradi). **Analitik rubrika** har bir mezonni alohida baholaydi (batafsil teskari aloqa beradi).

### Analitik rubrika namunasi: “Mening sevimli faslim” (3-sinf, ijodiy matn)

| Mezon | 3 – Yuqori | 2 – O‘rta | 1 – Quyi |
|---|---|---|---|
| Mazmun | Fasl aniq tasvirlangan, 3+ dalil/misol | Fasl tasvirlangan, 1–2 misol | Mavzudan chetga chiqqan |
| Tuzilish | Kirish, asosiy qism, xulosa bor | Bir qismi yetishmaydi | Gaplar tartibsiz |
| Imlo | 0–1 xato | 2–4 xato | 5 va undan ortiq xato |
| Lug‘at | Sifat va o‘xshatishlardan foydalangan | Oddiy so‘zlar, takrorlar bor | So‘z boyligi juda cheklangan |

## Rubrika tuzish algoritmi

1. O‘quv maqsadi va kutilgan natijani aniqlang.
2. 3–5 ta asosiy mezon tanlang (ko‘p mezon o‘quvchini chalg‘itadi).
3. Darajalar sonini belgilang (boshlang‘ich sinfda 3 daraja qulay).
4. Har bir daraja uchun **kuzatiladigan** deskriptor yozing (“yaxshi”, “a’lo” kabi umumiy so‘zlardan qoching).
5. Rubrikani o‘quvchiga oldindan tanishtiring va namunada sinab ko‘ring.

> [!WARNING] Ko‘p uchraydigan xato
> “Ish chiroyli bajarilgan” – deskriptor emas. Deskriptor o‘lchanadigan bo‘lishi kerak: “Rasmda kamida 4 ta o‘simlik qismi to‘g‘ri belgilangan”.`,
    terms: ['Mezon', 'Ko‘rsatkich', 'Deskriptor', 'Analitik rubrika', 'Holistik rubrika', 'Reproduktiv daraja', 'Ijodiy daraja'],
    review: ['Mezon va deskriptorning farqini misol bilan tushuntiring.', 'Reproduktiv va ijodiy darajadagi topshiriqqa misol keltiring.', 'Analitik rubrikaning afzalliklari nimada?'],
    questions: [
        { q: 'Deskriptor nima?', o: ['Baholanadigan umumiy soha', 'Har bir daraja uchun aniq, kuzatiladigan tavsif', 'Yakuniy ball', 'Test savoli'], a: 1, e: 'Deskriptor – mezonning har bir darajasi uchun o‘lchanadigan tavsif.' },
        { q: '“Ko‘paytirish jadvalini yoddan ayt” topshirig‘i qaysi darajaga mos?', o: ['Reproduktiv', 'Produktiv', 'Qisman izlanuvchan', 'Ijodiy'], a: 0, e: 'Eslab qolish va qayta tiklash – reproduktiv daraja.' },
        { q: '“Ko‘paytirishga oid o‘z masalangni tuz” topshirig‘i qaysi darajaga mos?', o: ['Reproduktiv', 'Produktiv', 'Ijodiy (kreativ)', 'Diagnostik'], a: 2, e: 'Yangi mahsulot yaratish – ijodiy daraja.' },
        { q: 'Analitik rubrikaning holistik rubrikadan asosiy afzalligi nimada?', o: ['Tezroq to‘ldiriladi', 'Har bir mezon bo‘yicha batafsil teskari aloqa beradi', 'Mezonlar talab qilinmaydi', 'Faqat summativ baholashda ishlatiladi'], a: 1, e: 'Analitik rubrika har bir mezonni alohida baholab, batafsil ma’lumot beradi.' },
        { q: 'Quyidagilardan qaysi biri to‘g‘ri tuzilgan deskriptor?', o: ['Ish chiroyli bajarilgan', 'O‘quvchi yaxshi harakat qilgan', 'Rasmda kamida 4 ta o‘simlik qismi to‘g‘ri belgilangan', 'A’lo darajada'], a: 2, e: 'Deskriptor kuzatiladigan va o‘lchanadigan bo‘lishi kerak.' },
        { q: 'Boshlang‘ich sinf rubrikasida nechta mezon tavsiya etiladi?', o: ['1 ta', '3–5 ta', '10–12 ta', '20 tadan ortiq'], a: 1, e: '3–5 ta asosiy mezon – optimal; ko‘p mezon o‘quvchini chalg‘itadi.' }
    ]
},
{
    chapter: 'II bob', icon: 'fa-comments', duration: 20,
    title: 'Teskari aloqa, o‘zaro baholash va o‘z-o‘zini baholash',
    summary: 'Samarali teskari aloqa tamoyillari, “sendvich” modeli, peer va self-assessment usullari.',
    goals: ['Samarali teskari aloqa tamoyillarini bilish', 'O‘quvchi ishiga konstruktiv izoh yozish', 'O‘zaro va o‘z-o‘zini baholashni tashkil etish'],
    content: `## Samarali teskari aloqa tamoyillari

- **Aniq** – “Yaxshi!” emas, “Maxrajlarni to‘g‘ri tenglashtirding”;
- **O‘z vaqtida** – ish bajarilgandan keyin imkon qadar tez;
- **Mezonga bog‘liq** – rubrika va maqsadga tayangan;
- **Keyingi qadamni ko‘rsatuvchi** – “Endi … ni tekshirib ko‘r”;
- **Shaxsga emas, ishga qaratilgan** – “Sen dangasasan” emas, “Bu qismda tushuntirish yetishmayapti”.

## “Sendvich” va “Ikki yulduz – bitta tilak”

| Qadam | Namuna (2-sinf, matematika) |
|---|---|
| 1. Yutuq (yulduz) | “Masala shartini to‘g‘ri yozib olding.” |
| 2. Yutuq (yulduz) | “Qo‘shishni ustun shaklida tartibli bajarding.” |
| 3. Tilak (keyingi qadam) | “Javobga o‘lchov birligini (so‘m) yozishni unutma.” |

## O‘zaro baholash (peer assessment)

O‘quvchilar oldindan tanishtirilgan oddiy mezonlar asosida bir-birining ishini baholaydi. Boshlang‘ich sinfda buning uchun rasmli belgilar (yulduzcha, smaylik) va 2–3 mezondan iborat kartochkalar qo‘llaniladi.

## O‘z-o‘zini baholash (self-assessment)

- “Bugun men … ni o‘rgandim”, “Menga … qiyin bo‘ldi” jumlalarini davom ettirish;
- Muvaffaqiyat mezonlari ro‘yxatida belgi qo‘yish;
- “Bilim zinapoyasi” – o‘quvchi o‘zini qaysi pog‘onada his qilishini belgilaydi.

> [!TIP] Raqamli imkoniyat
> Google Forms, Padlet va Mentimeter orqali o‘zaro va o‘z-o‘zini baholashni anonim, tez va ko‘rgazmali tashkil etish mumkin.`,
    terms: ['Teskari aloqa', 'Peer assessment', 'Self-assessment', 'Ikki yulduz – bitta tilak', 'Refleksiya'],
    review: ['Samarali teskari aloqaning 3 ta belgisini ayting.', '“Ikki yulduz – bitta tilak” usuli qanday qo‘llaniladi?', 'Boshlang‘ich sinfda o‘zaro baholashni qanday tashkil qilish mumkin?'],
    questions: [
        { q: 'Quyidagi teskari aloqalardan qaysi biri eng samarali?', o: ['“Yaxshi!”', '“Yana harakat qil.”', '“Maxrajlarni to‘g‘ri tenglashtirding; endi javobni qisqartirishni tekshir.”', '“Sen dangasasan.”'], a: 2, e: 'Samarali teskari aloqa aniq va keyingi qadamni ko‘rsatadi.' },
        { q: '“Ikki yulduz – bitta tilak” usulida “tilak” nimani bildiradi?', o: ['O‘quvchining orzusi', 'Keyingi qadam uchun aniq taklif', 'Qo‘shimcha ball', 'Jazo'], a: 1, e: '“Tilak” – yaxshilash uchun bitta aniq taklif.' },
        { q: 'Peer assessment nima?', o: ['O‘qituvchi tomonidan baholash', 'O‘quvchilarning bir-birini mezon asosida baholashi', 'Ota-ona tomonidan baholash', 'Tashqi ekspert baholashi'], a: 1, e: 'Peer assessment – o‘zaro baholash.' },
        { q: 'Teskari aloqa nimaga qaratilishi kerak?', o: ['O‘quvchi shaxsiga', 'Bajarilgan ishga va mezonlarga', 'Boshqa o‘quvchilar bilan taqqoslashga', 'Ota-onaning mavqeiga'], a: 1, e: 'Teskari aloqa shaxsga emas, ishga qaratiladi.' },
        { q: '“Bilim zinapoyasi” qaysi baholash shakliga misol?', o: ['O‘z-o‘zini baholash', 'Summativ test', 'Davlat attestatsiyasi', 'Diagnostik intervyu'], a: 0, e: 'O‘quvchi o‘zini qaysi pog‘onada his qilishini belgilaydi – self-assessment.' },
        { q: 'Boshlang‘ich sinfda o‘zaro baholash kartochkasida nechta mezon bo‘lgani qulay?', o: ['2–3 ta', '8–10 ta', '15 ta', 'Mezonsiz'], a: 0, e: 'Kichik yoshdagi o‘quvchilar uchun 2–3 ta oddiy, rasmli mezon qulay.' }
    ]
},
{
    chapter: 'II bob', icon: 'fa-lightbulb', duration: 30,
    title: 'Meta-fan ta’lim texnologiyalari va interfaol metodlar',
    summary: 'Loyiha, tanqidiy fikrlash, muammoli ta’lim, simulyatsiya, hamkorlikda o‘qitish va “Flipped learning” texnologiyalari.',
    goals: ['Meta-fan ta’lim texnologiyalari va ularga mos metodlarni bilish', '“Flipped learning” va an’anaviy darsni qiyoslash', 'Texnologiyalardan baholash maqsadida foydalanish'],
    content: `## Meta-fan ta’lim texnologiyalari to‘plami

Pedagogik tajriba-sinovning shakllantiruvchi bosqichida quyidagi texnologiyalar qo‘llanilgan (2.3.1-jadval):

| Texnologiya | O‘qitish metodlari | Baholashdagi o‘rni |
|---|---|---|
| Loyihalash faoliyati | Loyihalar metodi | Mahsulot va jarayonni rubrika bilan baholash |
| Tanqidiy fikrlashni rivojlantirish | Aqliy hujum, munozara, klaster, “G‘oyalar savati” | Fikrlash darajasini kuzatish |
| Muammoli ta’lim | Muammoli seminar, muammoli taqdimot, klaster | Muammoni hal qilish ko‘nikmasini baholash |
| Simulyatsiya (modellash) | O‘yin va o‘yindan tashqari metodlar | Real vaziyatga yaqin sharoitda baholash |
| “Munozara” texnologiyasi | Munozara | Argumentatsiyani baholash |
| Hamkorlikda o‘qitish | “Vizillovchi guruhlar” | Guruh va individual hissani baholash |
| Kognitiv vizualizatsiya | Aql xaritasi, mavzu taqdimoti | Tushunchalar o‘rtasidagi bog‘liqlikni baholash |

## “Flipped learning” (teskari sinf)

Mavzuning nazariy qismi auditoriyadan tashqarida (videodars, matn) o‘rganiladi; darsda esa talabalar o‘qituvchi rahbarligida murakkab kognitiv faoliyatni talab qiladigan topshiriqlarni bajaradi.

| An’anaviy ta’lim | “Flipped learning” |
|---|---|
| Darsni boshlashda auditoriyaning tayyorgarligiga e’tibor qaratiladi | Darsga kirish yangi mavzuni muhokama qilish orqali amalga oshiriladi |
| Uyga vazifa tekshiriladi va baholanadi | Uyda o‘rganilgan mavzu topshiriqlar orqali mustahkamlanadi |
| Yangi mavzu bayoni tinglanadi | Talabalar mavzuni juft va kichik guruhlarda taqdimot orqali o‘rganadi |
| Yangi mavzu mustahkamlanadi | O‘qituvchi nazorati qo‘llab-quvvatlash va baholash orqali amalga oshiriladi |
| Uyga vazifa beriladi | Keyingi yangi mavzu topshiriladi |

## “Keys” (case) texnologiyasi

Real pedagogik vaziyat tavsifi asosida talaba muammoni tahlil qiladi, yechim variantlarini taklif qiladi va asoslaydi. Platformadagi **“Pedagogik vaziyatlar”** mashqi aynan shu texnologiyaga asoslangan.

## Pedagogik tamoyillar

Model asosida: tizimlilik, ilmiylik, ko‘rgazmalilik, uzviylik, onglilik, faollik, muammolilik, amaliyotga yo‘naltirilganlik, maqsadlilik va axloqiy-etik tamoyillar yotadi.`,
    terms: ['Meta-fan texnologiyalar', 'Flipped learning', 'Keys texnologiyasi', 'Klaster', 'Aql xaritasi', 'Simulyatsiya'],
    review: ['Muammoli ta’lim texnologiyasida qaysi metodlar qo‘llaniladi?', '“Flipped learning”ning an’anaviy darsdan 2 ta farqini ayting.', 'Simulyatsiya texnologiyasi baholashda qanday afzallik beradi?'],
    questions: [
        { q: '“Flipped learning” texnologiyasida yangi mavzuning nazariy qismi qayerda o‘rganiladi?', o: ['Faqat darsda o‘qituvchi ma’ruzasi orqali', 'Auditoriyadan tashqarida (videodars, matn)', 'Imtihonda', 'O‘rganilmaydi'], a: 1, e: 'Teskari sinfda nazariya uyda o‘rganiladi, darsda faol topshiriqlar bajariladi.' },
        { q: '“Vizillovchi guruhlar” metodi qaysi texnologiyaga tegishli?', o: ['Muammoli ta’lim', 'Hamkorlikda o‘qitish', 'Kognitiv vizualizatsiya', 'Loyihalash'], a: 1, e: '“Vizillovchi guruhlar” – hamkorlikda o‘qitish metodi.' },
        { q: 'Aql xaritasi metodi qaysi texnologiyaga kiradi?', o: ['Kognitiv vizualizatsiya', 'Simulyatsiya', 'Munozara', 'Loyihalash'], a: 0, e: 'Aql xaritasi – kognitiv vizualizatsiya texnologiyasi metodi.' },
        { q: 'Klaster, aqliy hujum, “G‘oyalar savati” qaysi texnologiyaga xos?', o: ['Tanqidiy fikrlashni rivojlantirish', 'Masofaviy ta’lim', 'Summativ baholash', 'Simulyatsiya'], a: 0, e: 'Bular tanqidiy fikrlashni rivojlantirish texnologiyasi metodlari.' },
        { q: 'Real pedagogik vaziyat tavsifi asosida muammoni tahlil qilish qaysi texnologiya?', o: ['Keys (case) texnologiyasi', 'Flipped learning', 'Dasturlashtirilgan ta’lim', 'Klaster'], a: 0, e: 'Keys texnologiyasi real vaziyatlarni tahlil qilishga asoslanadi.' },
        { q: '“Flipped learning”da darsda o‘qituvchining vazifasi nima?', o: ['Mavzuni to‘liq aytib berish', 'Talabani mavzuning asosiy va qiyin jihatlariga yo‘naltirish, faoliyatini qo‘llab-quvvatlash va baholash', 'Faqat davomatni tekshirish', 'Uy vazifasini ko‘chirtirish'], a: 1, e: 'O‘qituvchi yo‘naltiruvchi, qo‘llab-quvvatlovchi va baholovchi rolida bo‘ladi.' }
    ]
},
{
    chapter: 'III bob', icon: 'fa-laptop-code', duration: 25,
    title: 'Raqamli baholash vositalari va platformalari',
    summary: 'Videodars, interaktiv resurs, ovozli ta’lim va onlayn so‘rov vositalari; LMS platformalarda baholashni tashkil etish.',
    goals: ['Baholash maqsadiga mos raqamli vositani tanlash', 'LMS (Moodle, Google Classroom) imkoniyatlarini bilish', 'Raqamli baholashda axborot xavfsizligi va etikani hisobga olish'],
    content: `## Qo‘llaniladigan texnologiyalar (3.1.2-jadval)

| Tur | Texnologiya | Izoh |
|---|---|---|
| Videodars | Powtoon, Canva, Clipchamp | Dars mazmunini animatsiyali qilish |
| Interaktiv resurs | Genially, H5P, Wordwall | Test, slayd, jarayonli sxema |
| Ovozli ta’lim | Vocaroo, Audacity | Tushunchalarni ovoz bilan tushuntirish, o‘qish texnikasini yozib olish |
| Onlayn fikrlar | Mentimeter, Google Forms | Refleksiya va baholash uchun |

## LMS platformalarda baholash

- **Moodle** – savollar banki, avtomatik baholash, rubrika va “Workshop” (o‘zaro baholash) moduli;
- **Google Classroom** – topshiriq, rubrika, izoh va baholar jurnali;
- **Microsoft Teams** – Assignments, Forms orqali test va refleksiya;
- **HEMIS** – oliy ta’limda talabaning baholari, reytingi va davomati elektron yuritiladi.

## Vosita tanlash algoritmi

1. **Maqsad:** diagnostika, formativ yoki summativ baholashmi?
2. **Javob turi:** yopiq (test), ochiq (matn), og‘zaki (audio), mahsulot (loyiha)?
3. **Teskari aloqa tezligi:** darhol kerakmi yoki keyinroq?
4. **Imkoniyat:** qurilmalar, internet, o‘quvchi yoshi.

> [!WARNING] Etika va xavfsizlik
> O‘quvchilarning shaxsiy ma’lumotlari va natijalarini ochiq e’lon qilmang; anonim so‘rovlardan foydalaning; ota-onalarga natijani shaxsiy tarzda yetkazing.

## “Digital Assessment Tools”

Tadqiqot tavsiyasiga ko‘ra bo‘lajak boshlang‘ich sinf o‘qituvchilari uchun “Digital Assessment Tools” mavzusida maxsus seminar-treninglar tashkil etish maqsadga muvofiq. Platformaning [Raqamli vositalar](/tools) bo‘limida har bir vosita bo‘yicha qisqa yo‘riqnoma berilgan.`,
    terms: ['LMS', 'Moodle', 'Avtomatik baholash', 'Interaktiv resurs', 'HEMIS'],
    review: ['Refleksiya uchun qaysi raqamli vositalardan foydalanish mumkin?', 'Moodle’ning baholashga oid qaysi imkoniyatlarini bilasiz?', 'Raqamli vosita tanlashda nimalarni hisobga olish kerak?'],
    questions: [
        { q: 'Refleksiya va onlayn fikr yig‘ish uchun qaysi vositalar tavsiya etilgan?', o: ['Powtoon, Canva', 'Mentimeter, Google Forms', 'Vocaroo, Audacity', 'Clipchamp'], a: 1, e: '3.1.2-jadvalga ko‘ra: onlayn fikrlar – Mentimeter, Google Forms.' },
        { q: 'Wordwall, H5P, Genially qaysi turga kiradi?', o: ['Videodars', 'Interaktiv resurs', 'Ovozli ta’lim', 'LMS'], a: 1, e: 'Ular interaktiv resurslar: test, slayd, jarayonli sxema.' },
        { q: 'O‘quvchining o‘qish texnikasini yozib olib baholash uchun qaysi vosita qulay?', o: ['Vocaroo', 'Canva', 'Wordwall', 'Excel'], a: 0, e: 'Vocaroo – ovozni yozib olish va havola orqali ulashish vositasi.' },
        { q: 'Moodle’dagi o‘zaro baholash moduli qanday ataladi?', o: ['Quiz', 'Workshop', 'Forum', 'Glossary'], a: 1, e: 'Workshop moduli peer assessment uchun mo‘ljallangan.' },
        { q: 'Oliy ta’limda talabalar baholari va reytingi qaysi tizimda yuritiladi?', o: ['HEMIS', 'Kahoot', 'Padlet', 'Canva'], a: 0, e: 'HEMIS – oliy ta’lim jarayonlarini boshqarish axborot tizimi.' },
        { q: 'Raqamli baholashda qaysi amal etikaga ZID?', o: ['Anonim so‘rovlardan foydalanish', 'Natijani ota-onaga shaxsiy yetkazish', 'Barcha o‘quvchilar baholarini ism-sharifi bilan ochiq guruhga joylash', 'Rubrikani oldindan tanishtirish'], a: 2, e: 'Shaxsiy natijalarni ochiq e’lon qilish maxfiylikni buzadi.' }
    ]
},
{
    chapter: 'III bob', icon: 'fa-chart-column', duration: 25,
    title: 'Baholash natijalarini tahlil qilish va refleksiya',
    summary: 'Natijalarni sifat va miqdor jihatdan tahlil qilish, o‘zlashtirish dinamikasi, ota-onalar bilan ishlash va pedagogik refleksiya.',
    goals: ['O‘quvchilar natijalarini darajalar bo‘yicha guruhlash', 'Oddiy statistik ko‘rsatkichlarni (o‘rtacha, ulush) hisoblash va talqin qilish', 'Natija asosida darsni qayta rejalashtirish'],
    content: `## Natijalarni tahlil qilish

Baholash natijalari “jurnalda qolib ketmasligi” kerak. Ular asosida o‘qituvchi quyidagi savollarga javob beradi:

- Sinfning necha foizi maqsadga erishdi? (yuqori / o‘rta / quyi daraja ulushi)
- Qaysi topshiriq yoki mezon bo‘yicha xatolar ko‘p?
- Qaysi o‘quvchilarga qo‘shimcha yordam yoki murakkabroq topshiriq kerak?

## Oddiy ko‘rsatkichlar

| Ko‘rsatkich | Hisoblash | Talqin |
|---|---|---|
| O‘rtacha ball | Barcha ballar yig‘indisi / o‘quvchilar soni | Sinfning umumiy darajasi |
| O‘zlashtirish ulushi | Maqsadga erishganlar / jami × 100% | Mavzuni o‘zlashtirish samarasi |
| Sifat ko‘rsatkichi | Yuqori daraja / jami × 100% | Chuqur o‘zlashtirish darajasi |
| Dinamika | Yakuniy ulush − dastlabki ulush | Rivojlanish samaradorligi |

## Tadqiqotdagi misol

Tajriba guruhida (218 talaba) yuqori daraja ulushi tajriba boshida **7,8%** bo‘lgan bo‘lsa, yakunida **20,6%** ga, o‘rta daraja **21,1%** dan **59,2%** ga oshgan; past daraja esa **71,1%** dan **20,2%** ga kamaygan. Nazorat guruhida o‘zgarish ancha kichik bo‘lgan. Batafsil – [Tadqiqot](/about#results) sahifasida.

## Pedagogik refleksiya

1. **Nima bo‘ldi?** – faktlar va natijalar.
2. **Nima uchun?** – sabablarni tahlil qilish (topshiriq, vaqt, tushuntirish usuli).
3. **Endi nima qilaman?** – aniq o‘zgartirishlar rejasi.

> [!TIP] Ota-onalar bilan muloqot
> Natijani raqam bilan emas, o‘quvchining yutug‘i va keyingi maqsadi bilan yetkazing: “Ali endi 100 ichida qo‘shishni ishonchli bajaradi; keyingi maqsad – ayirishda o‘nlikdan o‘tish”.`,
    terms: ['O‘zlashtirish ulushi', 'Sifat ko‘rsatkichi', 'Dinamika', 'Refleksiya', 'Differensiatsiya'],
    review: ['O‘zlashtirish ulushi va sifat ko‘rsatkichi qanday hisoblanadi?', 'Refleksiyaning 3 bosqichini ayting.', 'Natijani ota-onaga qanday yetkazish samarali?'],
    questions: [
        { q: 'Sinfda 25 o‘quvchidan 20 tasi maqsadga erishdi. O‘zlashtirish ulushi qancha?', o: ['20%', '75%', '80%', '125%'], a: 2, e: '20 / 25 × 100% = 80%.' },
        { q: 'Sifat ko‘rsatkichi qanday hisoblanadi?', o: ['Yuqori daraja olganlar / jami × 100%', 'Jami ball / o‘quvchilar soni', 'Past daraja / jami', 'Davomat foizi'], a: 0, e: 'Sifat ko‘rsatkichi – yuqori daraja ulushi.' },
        { q: 'Tadqiqotda tajriba guruhida yuqori daraja ulushi yakunda necha foizga yetdi?', o: ['7,8%', '10,1%', '20,6%', '59,2%'], a: 2, e: 'Tajriba guruhida yuqori daraja 7,8% dan 20,6% ga oshgan.' },
        { q: 'Pedagogik refleksiyaning to‘g‘ri tartibi qaysi?', o: ['Nima uchun? → Nima bo‘ldi? → Endi nima qilaman?', 'Nima bo‘ldi? → Nima uchun? → Endi nima qilaman?', 'Endi nima qilaman? → Nima bo‘ldi?', 'Faqat “Nima bo‘ldi?”'], a: 1, e: 'Avval faktlar, keyin sabablar, so‘ng o‘zgartirish rejasi.' },
        { q: 'Tajriba-sinov ishlarida jami nechta talaba ishtirok etgan?', o: ['218', '217', '435', '500'], a: 2, e: '218 tajriba + 217 nazorat = 435 talaba.' },
        { q: 'Natijani ota-onaga yetkazishning eng samarali usuli qaysi?', o: ['Faqat ballni aytish', 'Boshqa bolalar bilan taqqoslash', 'Yutuq va keyingi aniq maqsadni aytish', 'Xatolarni sanab berish'], a: 2, e: 'Yutuq + keyingi maqsad – motivatsiyani saqlaydi va hamkorlikka chorlaydi.' }
    ]
}
];
