import type { ExerciseData, SimCriterion, SimStudent } from './schema';

type Level = 'easy' | 'medium' | 'hard';
type SeedExercise = { lesson: number; type: 'classify' | 'match' | 'order' | 'choice' | 'feedback'; icon: string; level: Level; duration: number; title: string; summary: string; task: string; data: ExerciseData };

export const SEED_EXERCISES: SeedExercise[] = [
{
    lesson: 3, type: 'classify', icon: 'fa-shuffle', level: 'easy', duration: 10,
    title: 'Formativmi yoki summativ?', summary: 'Baholash vaziyatlarini tegishli turga ajrating.',
    task: 'Har bir vaziyat qaysi baholash turiga tegishli ekanini tanlang.',
    data: {
        categories: ['Diagnostik', 'Formativ', 'Summativ'],
        items: [
            { t: 'Yangi o‘quv yili boshida 2-sinf o‘quvchilarining o‘qish tezligini tekshirish', c: 0 },
            { t: 'Dars oxirida “chiqish chiptasi”ga bitta savolga javob yozdirish', c: 1 },
            { t: 'I chorak yakunida matematikadan nazorat ishi', c: 2 },
            { t: 'Mashq vaqtida “svetofor” kartochkalari bilan tushunishni tekshirish', c: 1 },
            { t: 'Yil yakunidagi o‘qish savodxonligi testi', c: 2 },
            { t: 'Mavzu boshida “Bu haqda nimalarni bilasiz?” degan aqliy hujum', c: 0 },
            { t: 'O‘quvchilar bir-birining ishini “Ikki yulduz – bitta tilak” bilan baholashi', c: 1 },
            { t: 'Loyiha ishining yakuniy himoyasi va baholanishi', c: 2 }
        ]
    }
},
{
    lesson: 4, type: 'match', icon: 'fa-link', level: 'easy', duration: 8,
    title: 'Tushuncha va ta’rifni moslashtiring', summary: 'Baholashga oid asosiy tushunchalarni ularning ta’riflari bilan juftlang.',
    task: 'Har bir tushuncha uchun mos ta’rifni ro‘yxatdan tanlang.',
    data: {
        pairs: [
            { l: 'Mezon', r: 'Nima baholanishini bildiruvchi umumiy soha' },
            { l: 'Deskriptor', r: 'Har bir daraja uchun aniq, kuzatiladigan tavsif' },
            { l: 'Rubrika', r: 'Mezon va darajalardan iborat baholash jadvali' },
            { l: 'Peer assessment', r: 'O‘quvchilarning bir-birini baholashi' },
            { l: 'Self-assessment', r: 'O‘quvchining o‘z ishini mezon asosida baholashi' },
            { l: 'Teskari aloqa', r: 'Natija haqida yaxshilashga yo‘naltirilgan ma’lumot' }
        ]
    }
},
{
    lesson: 3, type: 'order', icon: 'fa-arrow-down-1-9', level: 'medium', duration: 8,
    title: 'Formativ baholash siklini tiklang', summary: 'Formativ baholash bosqichlarini to‘g‘ri ketma-ketlikka keltiring.',
    task: 'Bosqichlarni yuqoriga/pastga surib, to‘g‘ri tartibga keltiring.',
    data: { items: ['O‘quv maqsadini aniqlash va o‘quvchiga yetkazish', 'Muvaffaqiyat mezonlarini birgalikda belgilash', 'O‘quvchi bilimi haqida dalil to‘plash', 'Aniq teskari aloqa berish', 'O‘qitishni natijaga ko‘ra moslashtirish'] }
},
{
    lesson: 4, type: 'classify', icon: 'fa-stairs', level: 'medium', duration: 12,
    title: 'Topshiriq qaysi darajada?', summary: 'Boshlang‘ich sinf topshiriqlarini o‘zlashtirish darajalari bo‘yicha tasniflang.',
    task: 'Har bir topshiriq o‘quvchidan qaysi darajadagi faoliyatni talab qilishini aniqlang.',
    data: {
        categories: ['Reproduktiv', 'Produktiv', 'Ijodiy'],
        items: [
            { t: '“Alifbo harflarini tartib bilan yozing.”', c: 0 },
            { t: '“Do‘konda 3 ta daftar 2500 so‘mdan. Jami qancha to‘lanadi?”', c: 1 },
            { t: '“Ertakning davomini o‘zingiz o‘ylab toping.”', c: 2 },
            { t: '“O‘simlikning qismlarini ayting.”', c: 0 },
            { t: '“Matndagi asosiy fikrni o‘z so‘zingiz bilan ifodalang.”', c: 1 },
            { t: '“Sinfimiz uchun suvni tejash bo‘yicha plakat yarating.”', c: 2 },
            { t: '“Ikki xonali sonlarni taqqoslab, > yoki < belgisini qo‘ying.”', c: 1 },
            { t: '“Ko‘paytirish jadvalini yoddan ayting.”', c: 0 }
        ]
    }
},
{
    lesson: 6, type: 'choice', icon: 'fa-people-group', level: 'medium', duration: 15,
    title: 'Pedagogik vaziyatlar (keys)', summary: 'Real sinf vaziyatlarida eng to‘g‘ri baholash qarorini tanlang.',
    task: 'Har bir vaziyatni o‘qing va eng maqbul pedagogik yechimni tanlang. Tanlovingizdan so‘ng izoh ko‘rsatiladi.',
    data: {
        cases: [
            { t: '3-sinfda Madina nazorat ishidan past ball oldi va yig‘lab qoldi. Ota-onasi ertaga maktabga kelmoqchi.', o: ['Ballni o‘zgartirib, yuqoriroq baho qo‘yish', 'Madina bilan ishini birga tahlil qilish, yutuq va keyingi qadamni belgilash; ota-onaga ham aniq reja bilan yetkazish', 'Sinf oldida xatolarini ko‘rsatish', 'Hech narsa qilmaslik, keyingi nazoratni kutish'], a: 1, e: 'Formativ yondashuv: xatoni o‘rganish imkoniyatiga aylantirish va ota-ona bilan hamkorlik. Bahoni sun’iy o‘zgartirish xolislikni buzadi.' },
            { t: 'Darsda mavzuni tushuntirdingiz. Qancha o‘quvchi tushunganini 1 daqiqada bilishingiz kerak.', o: ['Yozma nazorat ishi o‘tkazish', 'Mini doska yoki “bosh barmoq” orqali tezkor tekshiruv', 'Uy vazifasi berish va ertaga tekshirish', 'Eng faol o‘quvchidan so‘rash'], a: 1, e: 'Mini doska va “bosh barmoq” butun sinf javobini bir zumda ko‘rsatadi. Faqat faol o‘quvchidan so‘rash sinf haqida noto‘g‘ri tasavvur beradi.' },
            { t: 'Guruh loyihasida bir o‘quvchi deyarli ishlamadi, ammo guruh yuqori baho olishi kerak.', o: ['Barchaga bir xil baho qo‘yish', 'Guruh mahsuloti bilan birga individual hissani ham (kuzatuv, o‘zaro baholash) baholash', 'Ishlamagan o‘quvchini guruhdan chiqarish', 'Faqat guruh rahbarini baholash'], a: 1, e: 'Hamkorlikdagi ishda guruh natijasi va shaxsiy hissa alohida mezonlar bilan baholanadi.' },
            { t: 'Sinfning 70% i chiqish chiptasida bir xil xatoga yo‘l qo‘ydi.', o: ['Keyingi mavzuga o‘tish', 'Xato qilganlarga past baho qo‘yish', 'Keyingi darsda mavzuni boshqa usulda qayta tushuntirish va mashq qildirish', 'Faqat xato qilmaganlarni maqtash'], a: 2, e: 'Formativ baholashning mohiyati – natijaga ko‘ra o‘qitishni moslashtirish. Ommaviy xato tushuntirish usulini qayta ko‘rib chiqish kerakligini bildiradi.' },
            { t: 'Ota-onalar majlisida barcha o‘quvchilar baholarini ekranga chiqarish taklif qilindi.', o: ['Rozi bo‘lish – bu shaffoflik', 'Faqat a’lochilarni ko‘rsatish', 'Umumiy sinf statistikasini anonim ko‘rsatish, shaxsiy natijani esa har bir ota-onaga alohida yetkazish', 'Faqat past baholilarni ko‘rsatish'], a: 2, e: 'Shaxsiy ma’lumotlar maxfiyligi va o‘quvchi qadr-qimmati hurmat qilinishi lozim.' }
        ]
    }
},
{
    lesson: 7, type: 'choice', icon: 'fa-toolbox', level: 'medium', duration: 10,
    title: 'Mos raqamli vositani tanlang', summary: 'Baholash maqsadiga eng mos raqamli vositani aniqlang.',
    task: 'Har bir vaziyat uchun eng mos vositani tanlang.',
    data: {
        cases: [
            { t: 'Dars oxirida o‘quvchilar “Bugun nimani o‘rgandim?” savoliga anonim javob yozsin va javoblar so‘z buluti ko‘rinishida chiqsin.', o: ['Mentimeter', 'Audacity', 'Canva', 'Clipchamp'], a: 0, e: 'Mentimeter real vaqtda so‘z buluti va so‘rovnomalar yaratadi.' },
            { t: '2-sinf o‘quvchilari uchun hayvonlar va ularning yashash joyini moslashtiruvchi o‘yin-test kerak.', o: ['Vocaroo', 'Wordwall', 'Google Sheets', 'Microsoft Word'], a: 1, e: 'Wordwall’da moslashtirish, viktorina, “g‘ildirak” kabi o‘yin shablonlari mavjud.' },
            { t: 'Har bir o‘quvchining she’r yod aytishini yozib olib, keyin rubrika bilan baholamoqchisiz.', o: ['Vocaroo', 'Mentimeter', 'Wordwall', 'Genially'], a: 0, e: 'Vocaroo ovoz yozib, havola bilan ulashish imkonini beradi.' },
            { t: 'Chorak yakuniy testini avtomatik baholanadigan qilib, natijalarni jadvalga yig‘moqchisiz.', o: ['Canva', 'Google Forms (test rejimi)', 'Powtoon', 'Audacity'], a: 1, e: 'Google Forms test rejimida avtomatik ball qo‘yadi va natijalarni Sheets’ga yig‘adi.' },
            { t: 'Talabalar o‘zaro baholashni mezonlar asosida, ishlarni almashtirib amalga oshirishi kerak.', o: ['Moodle Workshop', 'Powtoon', 'Vocaroo', 'Clipchamp'], a: 0, e: 'Moodle Workshop moduli peer assessment uchun maxsus yaratilgan.' }
        ]
    }
},
{
    lesson: 5, type: 'feedback', icon: 'fa-pen-to-square', level: 'hard', duration: 15,
    title: 'Konstruktiv teskari aloqa yozing', summary: 'O‘quvchi ishini o‘qib, “Ikki yulduz – bitta tilak” modelida izoh yozing.',
    task: '4-sinf o‘quvchisi Sardorning “Mening sevimli faslim” mavzusidagi matnini o‘qing va unga teskari aloqa yozing.',
    data: {
        work: 'Mening sevimli faslim bahor. Bahorda daraxtlar gullaydi. Qushlar uchib keladi. Havo iliq bo‘ladi. Men bahorda dalaga chiqib boychechak teraman. bahorni yaxshi ko‘raman chunki hamma narsa yashil bo‘ladi.',
        rubric: ['Mazmun: fasl tasvirlangan, shaxsiy tajriba bor', 'Tuzilish: kirish bor, xulosa qisqa', 'Imlo: gap bosh harf bilan boshlanmagan, vergul tushib qolgan', 'Lug‘at: sifatlar kam, gaplar qisqa va bir xil'],
        checklist: ['Kamida ikkita aniq yutuqni ko‘rsatdim (umumiy “yaxshi” emas)', 'Bitta aniq, bajarsa bo‘ladigan keyingi qadamni taklif qildim', 'Izohim rubrika mezonlariga bog‘langan', 'Izoh shaxsga emas, ishga qaratilgan va do‘stona ohangda', 'Izoh 4-sinf o‘quvchisi tushunadigan sodda tilda yozilgan'],
        praise: ['yaxshi', 'zo‘r', 'ajoyib', 'to‘g‘ri', 'yoqdi', 'qiziqarli', 'aniq', 'chiroyli', 'barakalla', 'yutuq', 'yulduz'],
        next: ['keyingi', 'harakat', 'qo‘sh', 'yoz', 'tekshir', 'urinib', 'tavsiya', 'taklif', 'bosh harf', 'vergul', 'sifat', 'tilak'],
        model: '⭐ Sardor, bahorni o‘z tajribang – dalaga chiqib boychechak terishing bilan tasvirlagansan, bu matnni jonli qilgan.\n⭐ Gaplaring mavzuga mos va tartibli: avval fasl, keyin tabiat o‘zgarishlari, so‘ng o‘z his-tuyg‘ularing.\n💡 Tilak: oxirgi gapni bosh harf bilan boshla va “chunki” oldidan vergul qo‘y. Keyingi safar daraxt va qushlarni tasvirlash uchun 2–3 ta sifat qo‘shib ko‘r (masalan, “oppoq gullar”, “sayroqi qushlar”).'
    }
},
{
    lesson: 6, type: 'classify', icon: 'fa-rotate-left', level: 'easy', duration: 8,
    title: 'An’anaviy dars yoki “Flipped learning”?', summary: 'Dars bosqichlarini tegishli texnologiyaga ajrating.',
    task: 'Har bir holat an’anaviy darsga yoki “Flipped learning”ga xosligini aniqlang.',
    data: {
        categories: ['An’anaviy', 'Flipped learning'],
        items: [
            { t: 'Yangi mavzu bayoni darsda tinglanadi', c: 0 },
            { t: 'Talabalar uyda videodarsni ko‘rib keladi', c: 1 },
            { t: 'Darsga kirish yangi mavzuni muhokama qilishdan boshlanadi', c: 1 },
            { t: 'Uyga berilgan vazifa tekshiriladi va baholanadi', c: 0 },
            { t: 'Mavzuni juft va kichik guruhlarda taqdimot orqali o‘rganishadi', c: 1 },
            { t: 'Dars oxirida uyga vazifa beriladi', c: 0 }
        ]
    }
},
{
    lesson: 4, type: 'classify', icon: 'fa-list-check', level: 'hard', duration: 12,
    title: 'Yaxshi deskriptorni ajrating', summary: 'Qaysi deskriptor kuzatiladigan va o‘lchanadigan, qaysi biri noaniq?',
    task: 'Har bir deskriptorni baholang: u rubrikada ishlatishga yaroqlimi yoki noaniqmi?',
    data: {
        categories: ['Aniq (yaroqli)', 'Noaniq'],
        items: [
            { t: '“Ish juda chiroyli bajarilgan”', c: 1 },
            { t: '“Matnda 0–1 ta imlo xatosi bor”', c: 0 },
            { t: '“O‘quvchi yaxshi harakat qilgan”', c: 1 },
            { t: '“Masala yechimining barcha qadamlari yozilgan”', c: 0 },
            { t: '“Asosiy fikrni kamida ikki dalil bilan asoslaydi”', c: 0 },
            { t: '“A’lo darajada tushungan”', c: 1 },
            { t: '“Rasmda o‘simlikning 4 ta qismi to‘g‘ri belgilangan”', c: 0 }
        ]
    }
}
];

type SeedSim = { subject: string; grade: string; icon: string; level: Level; title: string; summary: string; task: string; criteria: SimCriterion[]; students: SimStudent[] };

export const SEED_SIMULATORS: SeedSim[] = [
{
    subject: 'Matematika', grade: '2-sinf', icon: 'fa-calculator', level: 'easy',
    title: 'Ikki xonali sonlarni qo‘shish: matnli masala',
    summary: 'Uch nafar virtual o‘quvchining masala yechimini rubrika asosida baholang.',
    task: 'Masala: “Bog‘da 34 ta olma daraxti va 27 ta o‘rik daraxti bor. Bog‘da jami nechta daraxt bor?” Yechimni yozing va javobni to‘liq ifodalang.',
    criteria: [
        { n: 'Masala shartini tushunish', d: ['Amal noto‘g‘ri tanlangan', 'Amal to‘g‘ri, shart qisman yozilgan', 'Shart to‘liq tushunilgan, amal to‘g‘ri tanlangan'] },
        { n: 'Hisoblash to‘g‘riligi', d: ['Hisoblashda xato bor', 'O‘nlikdan o‘tishda kichik xato', 'Hisoblash to‘liq to‘g‘ri'] },
        { n: 'Javobning to‘liqligi', d: ['Javob yozilmagan', 'Faqat son yozilgan', 'To‘liq javob gapi bilan yozilgan'] }
    ],
    students: [
        { name: 'Aziza', color: '#e8590c', work: '34 + 27 = 61\nJavob: Bog‘da jami 61 ta daraxt bor.', expert: [3, 3, 3], fb: 'Aziza, shartni to‘g‘ri tushunding, o‘nlikdan o‘tib xatosiz qo‘shding va javobni to‘liq gap bilan yozding. Keyingi qadam: masalani tekshirish uchun ayirish amalidan foydalanib ko‘r (61 − 27).' },
        { name: 'Bekzod', color: '#1971c2', work: '34 + 27 = 51\n51', expert: [3, 1, 2], fb: 'Bekzod, qo‘shish amalini to‘g‘ri tanlading. 4 + 7 = 11 bo‘ladi – 1 ta o‘nlikni o‘nliklar xonasiga qo‘shishni unutding. Javobni “Bog‘da jami … ta daraxt bor” deb to‘liq yozishni mashq qilaylik.' },
        { name: 'Dilnoza', color: '#2f9e44', work: '34 − 27 = 7\nJavob: 7 ta daraxt.', expert: [1, 3, 2], fb: 'Dilnoza, ayirishni to‘g‘ri hisobladingu, lekin masalada “jami” so‘zi qo‘shishni talab qiladi. Masaladagi kalit so‘zlarni tagiga chizib o‘qishni odat qilaylik.' }
    ]
},
{
    subject: 'Ona tili', grade: '3-sinf', icon: 'fa-spell-check', level: 'medium',
    title: 'Ijodiy matn: “Kuz fasli”',
    summary: '5–6 gapli ijodiy matnlarni mazmun, tuzilish va imlo bo‘yicha baholang.',
    task: 'Topshiriq: “Kuz fasli” mavzusida 5–6 gapdan iborat matn yozing. Matnda kuzning belgilarini va o‘z his-tuyg‘ularingizni ifodalang.',
    criteria: [
        { n: 'Mazmun', d: ['Mavzudan chetga chiqqan', 'Kuz belgilari bor, his-tuyg‘u yo‘q', 'Kuz belgilari va his-tuyg‘ular aniq ifodalangan'] },
        { n: 'Tuzilish va gaplar soni', d: ['3 tadan kam gap, tartibsiz', '4–5 gap, qisman tartibli', '5–6 gap, mantiqiy ketma-ket'] },
        { n: 'Imlo va tinish belgilari', d: ['5 va undan ortiq xato', '2–4 xato', '0–1 xato'] }
    ],
    students: [
        { name: 'Malika', color: '#c2255c', work: 'Kuz keldi. Daraxtlar barglari sarg‘aydi va to‘kildi. Havo salqin bo‘lib qoldi. Bozorda uzum, anor va olma ko‘p. Men kuzni yaxshi ko‘raman, chunki bu hosil fasli. Kuzda maktabga borish menga quvonch bag‘ishlaydi.', expert: [3, 3, 3], fb: 'Malika, kuz belgilarini (barglar, havo, hosil) va o‘z quvonchingni chiroyli ifodalading, gaplar mantiqiy tartibda. Keyingi qadam: o‘xshatishlardan foydalanib ko‘r, masalan “barglar oltin tangalardek”.' },
        { name: 'Jasur', color: '#5f3dc4', work: 'kuz keldi barglar sariq. havo sovuq. men futbol o‘ynayman futbol zo‘r o‘yin', expert: [1, 1, 1], fb: 'Jasur, kuz belgilarini (sariq barglar, sovuq havo) to‘g‘ri sezding. Matn oxirida mavzudan chetga chiqib ketding. Har bir gapni bosh harf bilan boshlab, nuqta bilan tugat; kuz haqida yana 2–3 gap qo‘sh.' },
        { name: 'Nodira', color: '#0c8599', work: 'Kuzda daraxtlarning barglari sarg‘ayadi. Qushlar issiq o‘lkalarga uchib ketadi. Kunlar qisqarib, tunlar uzayadi. Dalalarda paxta terimi boshlanadi.', expert: [2, 2, 3], fb: 'Nodira, kuz belgilarini aniq va xatosiz yozding – barakalla! Topshiriqda his-tuyg‘ular ham so‘ralgan edi: kuz senga qanday kayfiyat bag‘ishlashini 1–2 gap bilan qo‘sh.' }
    ]
},
{
    subject: 'O‘qish savodxonligi', grade: '4-sinf', icon: 'fa-book-open-reader', level: 'medium',
    title: 'Matnni tushunish: “Chumoli va kaptar”',
    summary: 'O‘quvchilarning matnni tushunish savoliga bergan javoblarini baholang.',
    task: 'Matn: “Chumoli suv ichgani soyga tushdi va oqib keta boshladi. Kaptar unga bir barg tashladi, chumoli bargga chiqib qutuldi. Keyinroq ovchi kaptarni otmoqchi bo‘lganda, chumoli ovchining oyog‘ini tishladi va kaptar uchib ketdi.”\nSavol: Ertakning asosiy g‘oyasi nima? Javobingizni matndan dalil bilan asoslang.',
    criteria: [
        { n: 'Asosiy g‘oyani aniqlash', d: ['G‘oya aniqlanmagan, faqat voqea aytilgan', 'G‘oya qisman ifodalangan', 'G‘oya aniq ifodalangan (yaxshilikka yaxshilik)'] },
        { n: 'Matndan dalil keltirish', d: ['Dalil yo‘q', 'Bitta dalil', 'Ikki va undan ortiq dalil'] },
        { n: 'Fikrni ifodalash', d: ['Fikr tushunarsiz', 'Tushunarli, lekin qisqa', 'Aniq, to‘liq gaplar bilan'] }
    ],
    students: [
        { name: 'Sevara', color: '#e67700', work: 'Ertakning g‘oyasi: yaxshilikka yaxshilik qaytadi. Kaptar chumolini barg tashlab qutqardi, keyin chumoli ham ovchini tishlab kaptarni qutqardi.', expert: [3, 3, 3], fb: 'Sevara, asosiy g‘oyani aniq topding va uni ikki voqea bilan asoslading. Keyingi qadam: bu g‘oyaga hayotingdan misol keltirib ko‘r.' },
        { name: 'Ulug‘bek', color: '#364fc7', work: 'Chumoli suvga tushdi. Kaptar barg tashladi. Ovchi keldi.', expert: [1, 1, 2], fb: 'Ulug‘bek, voqealarni to‘g‘ri tartibda eslading. Savol esa ertak bizga nimani o‘rgatishini so‘rayapti. “Bu ertak bizga … ni o‘rgatadi, chunki …” deb javob berib ko‘r.' },
        { name: 'Zarina', color: '#2b8a3e', work: 'Do‘stga yordam berish kerak, chunki kaptar chumoliga yordam berdi.', expert: [2, 2, 2], fb: 'Zarina, yordam berish haqidagi fikring to‘g‘ri yo‘nalishda va dalil keltirding. Ertakda ikkala qahramon ham bir-biriga yordam bergan – buni ham qo‘shsang, g‘oya to‘liq bo‘ladi.' },
        { name: 'Timur', color: '#a61e4d', work: 'Ovchilar yomon. Ular qushlarni otadi.', expert: [1, 1, 1], fb: 'Timur, qahramonlarga achinish tuyg‘ing yaxshi. Lekin ertakning asosiy g‘oyasi chumoli va kaptar o‘rtasidagi munosabat haqida. Matnni qayta o‘qib, kim kimga qanday yordam berganini topaylik.' }
    ]
},
{
    subject: 'Tabiiy fan', grade: '3-sinf', icon: 'fa-seedling', level: 'easy',
    title: 'O‘simlik qismlari va ularning vazifasi',
    summary: 'O‘quvchilar o‘simlik qismlari va vazifalari haqidagi yozma javoblarini baholang.',
    task: 'Topshiriq: O‘simlikning asosiy qismlarini sanab, har birining vazifasini qisqacha yozing.',
    criteria: [
        { n: 'Qismlarni bilish', d: ['2 tadan kam qism', '3 ta qism', '4 ta qism (ildiz, poya, barg, gul)'] },
        { n: 'Vazifalarni tushuntirish', d: ['Vazifalar yozilmagan yoki xato', 'Ayrim vazifalar to‘g‘ri', 'Barcha vazifalar to‘g‘ri'] },
        { n: 'Ilmiy atamalardan foydalanish', d: ['Atamalar ishlatilmagan', 'Ayrim atamalar to‘g‘ri', 'Atamalar o‘rinli va to‘g‘ri'] }
    ],
    students: [
        { name: 'Shahzoda', color: '#d6336c', work: 'Ildiz – tuproqdan suv va oziq oladi.\nPoya – suvni barglarga yetkazadi.\nBarg – quyosh nurida oziq tayyorlaydi.\nGul – urug‘ va meva hosil qiladi.', expert: [3, 3, 3], fb: 'Shahzoda, to‘rtala qismni va ularning vazifalarini to‘g‘ri yozding. Keyingi qadam: “fotosintez” atamasini o‘rganib, barg vazifasini shu so‘z bilan tushuntirib ko‘r.' },
        { name: 'Akmal', color: '#1864ab', work: 'Ildiz, poya, barg.\nIldiz yerda turadi. Barg yashil.', expert: [2, 1, 1], fb: 'Akmal, uchta qismni to‘g‘ri topding. “Barg yashil” – bu belgisi, vazifasi emas. Har bir qism o‘simlik uchun nima ish qilishini yozaylik va gulni ham qo‘shaylik.' },
        { name: 'Laylo', color: '#5c940d', work: 'Ildiz suv ichadi. Poya o‘simlikni ushlab turadi. Barg nafas oladi. Gul chiroyli bo‘ladi.', expert: [3, 2, 1], fb: 'Laylo, to‘rtala qismni topding va ildiz, poya vazifasini to‘g‘ri aytding. Gulning asosiy vazifasi – urug‘ hosil qilish. “Suv ichadi” o‘rniga “suvni shimadi” atamasini ishlataylik.' }
    ]
},
{
    subject: 'Guruh loyihasi', grade: '4-sinf', icon: 'fa-people-roof', level: 'hard',
    title: '“Suvni asraylik” mini-loyihasi: o‘zaro baholash',
    summary: 'Guruh a’zolarining loyihadagi hissasini kuzatuv yozuvlari asosida baholang.',
    task: 'Guruh “Suvni asraylik” mavzusida plakat tayyorladi va 2 daqiqalik taqdimot qildi. O‘qituvchi kuzatuv yozuvlari va o‘quvchilarning o‘zaro baholash varaqalari asosida har bir a’zoning hissasini baholang.',
    criteria: [
        { n: 'Guruh ishidagi faollik', d: ['Ishda deyarli qatnashmagan', 'Topshiriqni bajargan, tashabbus kam', 'Faol, boshqalarga yordam bergan'] },
        { n: 'Mazmunga hissa', d: ['G‘oya taklif qilmagan', '1 ta g‘oya yoki ma’lumot qo‘shgan', 'Bir nechta asosli g‘oya qo‘shgan'] },
        { n: 'Hamkorlik va muloqot', d: ['Boshqalarni tinglamagan', 'Ba’zan tinglagan', 'Hurmat bilan tinglagan, kelishuvga yordam bergan'] }
    ],
    students: [
        { name: 'Otabek', color: '#0b7285', work: 'Kuzatuv: Guruhni tashkil qildi, vazifalarni taqsimladi. “Tomchi suv – hayot” shiorini taklif qildi, ma’lumotlarni qidirdi.\nO‘zaro baholash: ⭐⭐⭐ “U hammaga yordam berdi.”', expert: [3, 3, 3], fb: 'Otabek, guruhni tashkil qilishda va g‘oyalar berishda yetakchilik qilding. Keyingi qadam: kamroq gapiradigan sheriklaringga ham so‘z berishni unutma.' },
        { name: 'Gulnoza', color: '#9c36b5', work: 'Kuzatuv: Plakat rasmlarini chizdi, rang tanlashda fikr berdi. Taqdimotda gapirmadi.\nO‘zaro baholash: ⭐⭐ “Rasmlar chiroyli.”', expert: [2, 2, 3], fb: 'Gulnoza, plakatning ko‘rinishiga katta hissa qo‘shding, sheriklar fikrini hurmat qilding. Keyingi loyihada taqdimotning bir qismini o‘zing gapirib ko‘r.' },
        { name: 'Sanjar', color: '#e8590c', work: 'Kuzatuv: Ko‘p vaqt boshqa ish bilan band bo‘ldi, oxirida bitta gap yozdi. Muhokamada sheriklarining gapini bo‘ldi.\nO‘zaro baholash: ⭐ “Kam yordam berdi.”', expert: [1, 2, 1], fb: 'Sanjar, plakatga yozgan gaping o‘rinli edi. Keyingi safar ish boshida o‘zing uchun bitta vazifa tanla va sheriklaring gapini oxirigacha tinglashga harakat qil.' }
    ]
}
];

export const SEED_TOOLS = [
    { name: 'Google Forms', category: 'Onlayn so‘rov', icon: 'fa-clipboard-list', url: 'https://forms.google.com', use: 'Test rejimida avtomatik baholash, diagnostik so‘rovnoma, refleksiya anketasi.', kinds: ['Diagnostik', 'Summativ'], tip: 'Sozlamalar → “Test” rejimini yoqing va har bir savolga ball hamda izoh qo‘shing.' },
    { name: 'Mentimeter', category: 'Onlayn so‘rov', icon: 'fa-square-poll-vertical', url: 'https://www.mentimeter.com', use: 'So‘z buluti, tezkor so‘rov, dars yakunidagi refleksiya.', kinds: ['Formativ'], tip: '“Word cloud” slaydi bilan “Bugun nimani o‘rgandim?” savolini bering.' },
    { name: 'Wordwall', category: 'Interaktiv resurs', icon: 'fa-gamepad', url: 'https://wordwall.net', use: 'Moslashtirish, viktorina, guruhlash o‘yinlari orqali bilimni mustahkamlash va tekshirish.', kinds: ['Formativ'], tip: 'Bitta kontentni turli shablonlarga (viktorina → moslashtirish) bir tugma bilan o‘tkazish mumkin.' },
    { name: 'H5P', category: 'Interaktiv resurs', icon: 'fa-cubes', url: 'https://h5p.org', use: 'Interaktiv video, “bo‘sh joyni to‘ldir”, sudrab-tashlash topshiriqlari; Moodle bilan integratsiya.', kinds: ['Formativ', 'Summativ'], tip: 'Interaktiv videoga savollar qo‘shib, “flipped” dars uchun foydalaning.' },
    { name: 'Genially', category: 'Interaktiv resurs', icon: 'fa-wand-magic-sparkles', url: 'https://genially.com', use: 'Interaktiv taqdimot, kvest, “escape room” ko‘rinishidagi baholash o‘yinlari.', kinds: ['Formativ'], tip: 'Gamifikatsiyalangan takrorlash darsi uchun tayyor shablonlardan foydalaning.' },
    { name: 'Powtoon', category: 'Videodars', icon: 'fa-film', url: 'https://www.powtoon.com', use: 'Animatsion videodarslar – “flipped learning” uchun nazariy material.', kinds: ['O‘qitish'], tip: '2–4 daqiqalik qisqa video yetarli; oxirida tekshiruv savoli qo‘ying.' },
    { name: 'Canva', category: 'Videodars', icon: 'fa-palette', url: 'https://www.canva.com', use: 'Rubrika, chek-list, plakat va taqdimot shablonlari; o‘quvchi loyihalari.', kinds: ['O‘qitish', 'Summativ'], tip: 'Rubrikani rangli va rasmli qilib boshlang‘ich sinf o‘quvchisiga tushunarli shaklga keltiring.' },
    { name: 'Clipchamp', category: 'Videodars', icon: 'fa-scissors', url: 'https://clipchamp.com', use: 'Videodarslarni montaj qilish, subtitr qo‘shish.', kinds: ['O‘qitish'], tip: 'Ekran yozuvi orqali topshiriqni bajarish namunasini ko‘rsating.' },
    { name: 'Vocaroo', category: 'Ovozli ta’lim', icon: 'fa-microphone', url: 'https://vocaroo.com', use: 'O‘qish texnikasi, she’r yod aytish, og‘zaki javoblarni yozib olish.', kinds: ['Formativ', 'Summativ'], tip: 'Yil davomida yozuvlarni saqlab, o‘qish ko‘nikmasi dinamikasini portfolio sifatida ko‘rsating.' },
    { name: 'Audacity', category: 'Ovozli ta’lim', icon: 'fa-wave-square', url: 'https://www.audacityteam.org', use: 'Podkast va audio topshiriqlarni tahrirlash.', kinds: ['O‘qitish'], tip: 'Matematik tushunchalarni ovozli tushuntirish podkastini yarating.' },
    { name: 'Moodle', category: 'LMS platforma', icon: 'fa-graduation-cap', url: 'https://moodle.org', use: 'Savollar banki, avtomatik test, rubrika, Workshop (o‘zaro baholash), baholar jurnali.', kinds: ['Formativ', 'Summativ'], tip: 'Workshop modulida o‘zaro baholash mezonlarini oldindan kiriting.' },
    { name: 'Google Classroom', category: 'LMS platforma', icon: 'fa-chalkboard-user', url: 'https://classroom.google.com', use: 'Topshiriq berish, rubrika bilan baholash, shaxsiy izoh qoldirish.', kinds: ['Formativ', 'Summativ'], tip: 'Rubrikani topshiriqqa biriktirsangiz, o‘quvchi mezonlarni oldindan ko‘radi.' },
    { name: 'Microsoft Teams', category: 'LMS platforma', icon: 'fa-users-rectangle', url: 'https://www.microsoft.com/microsoft-teams/education', use: 'Assignments, Forms, Reading Progress (o‘qish texnikasini baholash).', kinds: ['Formativ', 'Summativ'], tip: 'Reading Progress o‘qish tezligi va xatolarini avtomatik tahlil qiladi.' },
    { name: 'Padlet', category: 'Hamkorlik', icon: 'fa-note-sticky', url: 'https://padlet.com', use: 'O‘zaro baholash devori, “Ikki yulduz – bitta tilak” izohlari, guruh ishlari.', kinds: ['Formativ'], tip: 'Har bir guruh ishiga sheriklar izoh qoldiradigan devor yarating.' },
    { name: 'Kahoot!', category: 'Interaktiv resurs', icon: 'fa-trophy', url: 'https://kahoot.com', use: 'O‘yin shaklidagi viktorinalar, tezkor takrorlash.', kinds: ['Formativ'], tip: 'Natijalar hisobotidan eng ko‘p xato qilingan savolni toping va qayta tushuntiring.' },
    { name: 'Plickers', category: 'Onlayn so‘rov', icon: 'fa-qrcode', url: 'https://get.plickers.com', use: 'O‘quvchilarda qurilma bo‘lmasa ham kartochka orqali tezkor so‘rov.', kinds: ['Formativ'], tip: 'Boshlang‘ich sinf uchun qulay: faqat o‘qituvchida telefon bo‘lishi yetarli.' }
];

export const SEED_GLOSSARY: [string, string][] = [
    ['Analitik rubrika', 'Har bir mezon alohida darajalar bo‘yicha baholanadigan rubrika turi.'],
    ['Avtomatik baholash', 'Raqamli tizim tomonidan oldindan belgilangan to‘g‘ri javob asosida ball qo‘yish.'],
    ['Baholash', 'Ta’lim natijalari haqida ma’lumot to‘plash, tahlil qilish va ular asosida qaror qabul qilish jarayoni.'],
    ['Baholash kompetensiyasi', 'O‘qituvchining o‘quvchilar bilim, ko‘nikma va malakalarini tizimli baholashi, mezon va usullarni to‘g‘ri tanlashi, rivojlanishni kuzatishi va refleksiya qilish qobiliyati.'],
    ['Deskriptor', 'Mezonning muayyan darajasini tavsiflovchi aniq, kuzatiladigan ifoda.'],
    ['Diagnostik baholash', 'O‘qitish boshida o‘quvchilarning boshlang‘ich bilim darajasini aniqlash.'],
    ['Differensiatsiya', 'O‘quvchilarning ehtiyoj va darajasiga ko‘ra topshiriq va yordamni tabaqalashtirish.'],
    ['Flipped learning', '“Teskari sinf” – nazariy material darsdan tashqarida o‘rganilib, dars vaqti faol topshiriqlarga sarflanadigan texnologiya.'],
    ['Formativ baholash', 'O‘quv jarayoni davomida o‘rganishni yaxshilash maqsadida o‘tkaziladigan shakllantiruvchi baholash.'],
    ['Gibrid ta’lim', 'Kontaktli (auditoriya) va masofaviy ta’lim formatlarining uyg‘unlashuvi.'],
    ['Holistik rubrika', 'Ish yaxlit holda bitta umumiy daraja bilan baholanadigan rubrika turi.'],
    ['Ijodiy daraja', 'Bilimni yangi vaziyatda qo‘llab, yangi mahsulot yaratish darajasi (kreativ daraja).'],
    ['Keys texnologiyasi', 'Real vaziyat tavsifini tahlil qilish orqali muammoni hal qilishga o‘rgatuvchi texnologiya.'],
    ['Kompetensiya', 'Bilim, ko‘nikma, tajriba va shaxsiy sifatlarni amaliy faoliyatda samarali qo‘llay olish qobiliyati.'],
    ['Kompetentlik', 'Shaxsning muayyan kompetensiyalarni egallaganlik darajasi.'],
    ['LMS', 'Learning Management System – o‘quv jarayonini boshqarish tizimi (Moodle, Google Classroom).'],
    ['Mezon', 'Baholanadigan sifat yoki ko‘nikmani bildiruvchi asos.'],
    ['Meta-fan texnologiyalar', 'Muayyan fandan tashqari, umumiy (universal) ko‘nikmalarni rivojlantiruvchi ta’lim texnologiyalari.'],
    ['Muvaffaqiyat mezoni', 'O‘quvchi maqsadga erishganini bildiruvchi, unga tushunarli tilda ifodalangan belgi.'],
    ['Peer assessment', 'O‘zaro baholash – o‘quvchilarning mezonlar asosida bir-birining ishini baholashi.'],
    ['Portfolio', 'O‘quvchi ishlari va yutuqlarining tizimli to‘plami; rivojlanish dinamikasini ko‘rsatadi.'],
    ['Produktiv daraja', 'Bilimni tanish vaziyatlarda qo‘llash va tahlil qilish darajasi.'],
    ['Raqamli ta’lim muhiti', 'Raqamli resurslar, platformalar va vositalar asosida tashkil etilgan ta’lim makoni.'],
    ['Refleksiya', 'O‘z faoliyati va natijalarini anglash, tahlil qilish va takomillashtirish.'],
    ['Reproduktiv daraja', 'Bilimni eslab qolish va namuna asosida qayta tiklash darajasi.'],
    ['Rubrika', 'Mezonlar va darajalar tavsifidan iborat baholash jadvali.'],
    ['Self-assessment', 'O‘z-o‘zini baholash – o‘quvchining o‘z ishini mezonlar asosida baholashi.'],
    ['Simulyatsiya', 'Real jarayonni modellashtirib, xavfsiz muhitda amaliy ko‘nikma hosil qilish.'],
    ['Summativ baholash', 'Bo‘lim, chorak yoki kurs yakunida natijalarni qayd etuvchi yakuniy baholash.'],
    ['Teskari aloqa', 'O‘quvchiga uning natijasi va keyingi qadamlari haqida beriladigan ma’lumot.'],
    ['Xi-kvadrat (χ²) mezoni', 'Ikki guruh taqsimotlari o‘rtasidagi farqning statistik ahamiyatini tekshirish mezoni.']
];
