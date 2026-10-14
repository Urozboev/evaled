import { AuthShell } from '@/components/AuthShell';
import { ForgotForm } from '@/components/AuthForms';

export const metadata = { title: 'Parolni tiklash' };

export default function ForgotPage() {
    return (
        <AuthShell title="Parolni tiklash" lead="E-pochtangizni kiriting — parolni tiklash havolasini yuboramiz.">
            <ForgotForm />
        </AuthShell>
    );
}
