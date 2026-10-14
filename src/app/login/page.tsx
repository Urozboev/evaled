import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { LoginForm } from '@/components/AuthForms';
import { getCurrentUser } from '@/lib/auth';

export const metadata = { title: 'Kirish' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const { next } = await searchParams;
    if (await getCurrentUser()) redirect(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
    return (
        <AuthShell title="Kirish" lead="E-pochta va parolingiz bilan tizimga kiring.">
            <LoginForm next={next} />
        </AuthShell>
    );
}
