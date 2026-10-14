import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { groups, users } from '@/db/schema';
import { requireUser } from '@/lib/auth';
import { ROLES } from '@/lib/content';
import { PageHero, fmtDate } from '@/components/ui';
import { GroupForm, NameForm, PasswordForm } from '@/components/ProfileForms';

export const metadata = { title: 'Profil' };

export default async function ProfilePage() {
    const me = await requireUser('/profile');
    const db = await getDb();
    const [u] = await db.select({ createdAt: users.createdAt }).from(users).where(eq(users.id, me.id));
    const g = me.groupId ? (await db.select({ name: groups.name, code: groups.code }).from(groups).where(eq(groups.id, me.groupId)))[0] ?? null : null;
    return (
        <>
            <PageHero title="Profil va guruh" crumbs={[{ label: 'Profil' }]} lead={`${me.email} · ${ROLES[me.role]} · ro‘yxatdan o‘tgan: ${fmtDate(u.createdAt)}`} />
            <section className="section">
                <div className="container grid grid-2" style={{ alignItems: 'start' }}>
                    <div className="card"><h3 className="upper" style={{ fontSize: 17 }}><i className="fas fa-id-card" style={{ color: 'var(--primary)' }} /> Shaxsiy ma’lumotlar</h3><NameForm fullName={me.fullName} /></div>
                    {me.role === 'student' && <div className="card"><h3 className="upper" style={{ fontSize: 17 }}><i className="fas fa-users" style={{ color: 'var(--primary)' }} /> Guruh</h3><GroupForm current={g} /></div>}
                    <div className="card"><h3 className="upper" style={{ fontSize: 17 }}><i className="fas fa-key" style={{ color: 'var(--primary)' }} /> Parolni o‘zgartirish</h3><PasswordForm /></div>
                </div>
            </section>
        </>
    );
}
