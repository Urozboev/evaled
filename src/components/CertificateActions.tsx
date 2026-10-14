'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { issueCertificateAction } from '@/actions/learning';

export function CertificateActions({ eligible, issued, fullName }: { eligible: boolean; issued: boolean; fullName: string }) {
    const [name, setName] = useState(fullName);
    const [err, setErr] = useState('');
    const [pending, start] = useTransition();
    const router = useRouter();
    const issue = () => start(async () => {
        const r = await issueCertificateAction(name);
        if (r.error) setErr(r.error); else { setErr(''); router.refresh(); }
    });
    return (
        <div className="card">
            <div className="form-group">
                <label htmlFor="certName">Sertifikatdagi ism</label>
                <input id="certName" className="input" value={name} maxLength={80} onChange={e => setName(e.target.value)} disabled={!eligible} />
                <div className="field-hint">Familiya va ismingiz to‘g‘ri yozilganini tekshiring.</div>
            </div>
            {err && <div className="alert error"><i className="fas fa-circle-exclamation" /><div>{err}</div></div>}
            {!issued
                ? <button className="btn btn-success" style={{ width: '100%' }} disabled={!eligible || pending} onClick={issue}>{pending ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-award" />}Sertifikatni olish</button>
                : <>
                    <button className="btn btn-outline" style={{ width: '100%' }} disabled={pending || name.trim() === fullName} onClick={issue}><i className="fas fa-pen" />Ismni yangilash</button>
                    <button className="btn btn-primary mt-1" style={{ width: '100%' }} onClick={() => window.print()}><i className="fas fa-print" />Chop etish / PDF</button>
                    <p className="small muted mt-1 mb-0">Chop etish oynasida “PDF sifatida saqlash”ni tanlang.</p>
                </>}
        </div>
    );
}
