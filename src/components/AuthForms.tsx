'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, registerAction, requestResetAction, resetPasswordAction, type FormState } from '@/actions/auth';
import { Alert } from './ui';

export function Submit({ children, icon, className = 'btn btn-primary', full = true }: { children: React.ReactNode; icon?: string; className?: string; full?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={className} disabled={pending} style={full ? { width: '100%' } : undefined}>
            {pending ? <i className="fas fa-spinner fa-spin" /> : icon ? <i className={`fas ${icon}`} /> : null}{children}
        </button>
    );
}

export function PasswordInput({ name, id, placeholder, autoComplete, required = true }: { name: string; id: string; placeholder?: string; autoComplete?: string; required?: boolean }) {
    const [show, setShow] = useState(false);
    return (
        <div className="pw-wrap">
            <input id={id} name={name} type={show ? 'text' : 'password'} className="input" placeholder={placeholder} autoComplete={autoComplete} required={required} minLength={required ? 8 : undefined} />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}><i className={`far ${show ? 'fa-eye-slash' : 'fa-eye'}`} /></button>
        </div>
    );
}

export function FormMessage({ state }: { state: FormState }) {
    if (state?.error) return <Alert kind="error">{state.error}</Alert>;
    if (state?.ok) return <Alert kind="ok">{state.ok}</Alert>;
    return null;
}

export function LoginForm({ next }: { next?: string }) {
    const [state, action] = useActionState(loginAction, undefined);
    return (
        <form action={action} noValidate>
            <FormMessage state={state} />
            <input type="hidden" name="next" value={next || ''} />
            <div className="form-group">
                <label htmlFor="email">E-pochta</label>
                <input id="email" name="email" type="email" className="input" autoComplete="email" required defaultValue={state?.values?.email} placeholder="ism@misol.uz" />
            </div>
            <div className="form-group">
                <div className="flex between"><label htmlFor="password">Parol</label><Link href="/forgot-password" className="small">Parolni unutdingizmi?</Link></div>
                <PasswordInput id="password" name="password" autoComplete="current-password" required={false} />
            </div>
            <Submit icon="fa-right-to-bracket">Kirish</Submit>
            <p className="divider">Akkauntingiz yo‘qmi? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`}><b>Ro‘yxatdan o‘ting</b></Link></p>
        </form>
    );
}

export function RegisterForm({ code }: { code?: string }) {
    const [state, action] = useActionState(registerAction, undefined);
    const v = state?.values || {};
    return (
        <form action={action} noValidate>
            <FormMessage state={state} />
            <div className="form-group">
                <label htmlFor="fullName">Familiya va ism</label>
                <input id="fullName" name="fullName" className="input" autoComplete="name" required defaultValue={v.fullName} placeholder="Aliyeva Madina" />
                <div className="field-hint">Sertifikatda shu ism yoziladi.</div>
            </div>
            <div className="form-group">
                <label htmlFor="email">E-pochta</label>
                <input id="email" name="email" type="email" className="input" autoComplete="email" required defaultValue={v.email} placeholder="ism@misol.uz" />
            </div>
            <div className="form-grid">
                <div className="form-group"><label htmlFor="password">Parol</label><PasswordInput id="password" name="password" autoComplete="new-password" /><div className="field-hint">Kamida 8 belgi</div></div>
                <div className="form-group"><label htmlFor="password2">Parolni takrorlang</label><PasswordInput id="password2" name="password2" autoComplete="new-password" /></div>
            </div>
            <div className="form-group">
                <label htmlFor="groupCode">Guruh kodi <span className="muted small">(ixtiyoriy)</span></label>
                <input id="groupCode" name="groupCode" className="input" defaultValue={v.groupCode ?? code} placeholder="Masalan: K7Q2MX" maxLength={8} style={{ textTransform: 'uppercase', letterSpacing: '.1em' }} />
                <div className="field-hint">O‘qituvchingiz bergan kod. Keyin “Profil” sahifasida ham kiritish mumkin.</div>
            </div>
            <Submit icon="fa-user-plus">Ro‘yxatdan o‘tish</Submit>
            <p className="divider">Akkauntingiz bormi? <Link href="/login"><b>Kirish</b></Link></p>
        </form>
    );
}

export function ForgotForm() {
    const [state, action] = useActionState(requestResetAction, undefined);
    return (
        <form action={action} noValidate>
            <FormMessage state={state} />
            {!state?.ok && <>
                <div className="form-group">
                    <label htmlFor="email">Ro‘yxatdan o‘tgan e-pochtangiz</label>
                    <input id="email" name="email" type="email" className="input" required defaultValue={state?.values?.email} />
                </div>
                <Submit icon="fa-paper-plane">Havola yuborish</Submit>
            </>}
            <p className="divider"><Link href="/login"><i className="fas fa-arrow-left" /> Kirish sahifasiga qaytish</Link></p>
        </form>
    );
}

export function ResetForm({ token }: { token: string }) {
    const [state, action] = useActionState(resetPasswordAction, undefined);
    return (
        <form action={action} noValidate>
            <FormMessage state={state} />
            <input type="hidden" name="token" value={token} />
            <div className="form-group"><label htmlFor="password">Yangi parol</label><PasswordInput id="password" name="password" autoComplete="new-password" /></div>
            <div className="form-group"><label htmlFor="password2">Yangi parolni takrorlang</label><PasswordInput id="password2" name="password2" autoComplete="new-password" /></div>
            <Submit icon="fa-key">Parolni yangilash</Submit>
        </form>
    );
}
