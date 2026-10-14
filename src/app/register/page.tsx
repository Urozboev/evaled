import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { RegisterForm } from '@/components/AuthForms';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'Ro‘yxatdan o‘tish' };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
    if (await getCurrentUser()) redirect('/dashboard');
    const { code } = await searchParams;
    return (
        <AuthShell title="Ro‘yxatdan o‘tish" lead="Bir daqiqada akkaunt yarating — natijalaringiz saqlanib boradi.">
            <RegisterForm code={code} />
        </AuthShell>
    );
}
