'use client';

import { useActionState } from 'react';
import { changePasswordAction, joinGroupAction, updateProfileAction } from '@/actions/auth';
import { FormMessage, PasswordInput, Submit } from './AuthForms';

export function NameForm({ fullName }: { fullName: string }) {
    const [state, action] = useActionState(updateProfileAction, undefined);
    return (
        <form action={action}>
            <FormMessage state={state} />
            <div className="form-group"><label htmlFor="fullName">Familiya va ism</label><input id="fullName" name="fullName" className="input" defaultValue={fullName} required /><div className="field-hint">Sertifikatda shu ism yoziladi.</div></div>
            <Submit full={false} icon="fa-floppy-disk">Saqlash</Submit>
        </form>
    );
}

export function PasswordForm() {
    const [state, action] = useActionState(changePasswordAction, undefined);
    return (
        <form action={action}>
            <FormMessage state={state} />
            <div className="form-group"><label htmlFor="current">Joriy parol</label><PasswordInput id="current" name="current" autoComplete="current-password" required={false} /></div>
            <div className="form-grid">
                <div className="form-group"><label htmlFor="np">Yangi parol</label><PasswordInput id="np" name="password" autoComplete="new-password" /></div>
                <div className="form-group"><label htmlFor="np2">Takrorlang</label><PasswordInput id="np2" name="password2" autoComplete="new-password" /></div>
            </div>
            <Submit full={false} icon="fa-key">Parolni o‘zgartirish</Submit>
        </form>
    );
}

export function GroupForm({ current }: { current: { name: string; code: string } | null }) {
    const [state, action] = useActionState(joinGroupAction, undefined);
    return (
        <form action={action}>
            <FormMessage state={state} />
            {current && <p className="mb-2">Hozirgi guruhingiz: <b>{current.name}</b> <span className="code-badge">{current.code}</span></p>}
            <div className="form-group">
                <label htmlFor="groupCode">{current ? 'Boshqa guruh kodi' : 'Guruh kodi'}</label>
                <input id="groupCode" name="groupCode" className="input" placeholder="Masalan: K7Q2MX" maxLength={8} style={{ textTransform: 'uppercase', letterSpacing: '.1em', maxWidth: 260 }} />
                <div className="field-hint">Kodni o‘qituvchingizdan oling. {current && 'Bo‘sh qoldirib saqlasangiz, guruhdan chiqasiz.'}</div>
            </div>
            <Submit full={false} icon="fa-users">{current ? 'O‘zgartirish' : 'Guruhga qo‘shilish'}</Submit>
        </form>
    );
}
