import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { manageableGroup } from '@/lib/groups';
import { progressForUsers } from '@/lib/progress';

const cell = (v: unknown) => {
    const s = String(v ?? '');
    // Excel formula in’ektsiyasidan himoya
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return /[";\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const me = await getCurrentUser();
    if (!me) return new Response('Unauthorized', { status: 401 });
    const { id } = await params;
    const g = await manageableGroup(me, Number(id) || 0);
    if (!g) return new Response('Not found', { status: 404 });
    const db = await getDb();
    const st = await db.select({ id: users.id, name: users.fullName, email: users.email }).from(users).where(eq(users.groupId, g.id)).orderBy(asc(users.fullName));
    const prog = await progressForUsers(st.map(s => s.id));
    const head = ['Talaba', 'E-pochta', 'Darslar', 'Topshirilgan testlar', 'Testlar o‘rtachasi %', 'Mashqlar', 'Mashqlar o‘rtachasi %', 'Simulyatorlar', 'Simulyator moslik %', 'Yakuniy test %', 'Diagnostika (boshi) %', 'Diagnostika (oxiri) %', 'Umumiy progress %', 'Sertifikat'];
    const lines = [head.map(cell).join(';')];
    for (const s of st) {
        const p = prog.get(s.id)!;
        lines.push([s.name, s.email, `${p.lessonsDone}/${p.lessonsTotal}`, `${p.testsDone}/${p.testsTotal}`, p.testsTakenAvg, `${p.exDone}/${p.exTotal}`, p.exAvg, `${p.simDone}/${p.simTotal}`, p.simAvg, p.finalBest,
            p.diag.pre?.result.total ?? '', p.diag.post?.result.total ?? '', p.overall, p.certificate?.number ?? ''].map(cell).join(';'));
    }
    const name = `guruh-${g.code}.csv`;
    return new Response('﻿' + lines.join('\r\n'), {
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' }
    });
}
