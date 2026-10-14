import Link from 'next/link';
import { AuthShell } from '@/components/AuthShell';
import { ResetForm } from '@/components/AuthForms';
import { Alert } from '@/components/ui';

export const metadata = { title: 'Yangi parol' };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const { token } = await searchParams;
    return (
        <AuthShell title="Yangi parol" lead="Yangi parolingizni kiriting.">
            {token ? <ResetForm token={token} /> : <Alert kind="error">Havola noto‘g‘ri. <Link href="/forgot-password">Qaytadan so‘rov yuboring</Link>.</Alert>}
        </AuthShell>
    );
}
