import { SITE } from '@/lib/content';
import { fmtDate } from './ui';

export function CertificateView({ name, number, date, finalScore, overall, sample, verifyUrl }: {
    name: string; number: string; date: Date | string; finalScore: number; overall: number; sample?: boolean; verifyUrl?: string;
}) {
    return (
        <div className="cert" id="certPrint" style={sample ? { opacity: .6 } : undefined}>
            <div className="cert-inner">
                <div className="small upper muted" style={{ letterSpacing: '.12em' }}>{SITE.org}</div>
                <div className="cert-title mt-1">SERTIFIKAT</div>
                <small className="mt-1">Ushbu sertifikat</small>
                <div className="cert-name">{name || 'Ism Familiya'}</div>
                <small>quyidagi o‘quv kursini muvaffaqiyatli tamomlaganligini tasdiqlaydi:</small>
                <div className="cert-course mt-1">{SITE.title}</div>
                <small className="mt-1">Yakuniy test natijasi: {finalScore}% · Umumiy progress: {overall}%</small>
                <div className="cert-foot">
                    <div>Sana: <b>{fmtDate(date)}</b><br />Raqam: <b>{number}</b>{verifyUrl && <><br />Tekshirish: {verifyUrl}</>}</div>
                    <div style={{ textAlign: 'right' }}>Kurs muallifi:<br /><b>{SITE.author}</b></div>
                </div>
            </div>
            {sample && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}><span style={{ transform: 'rotate(-18deg)', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(28px,6vw,64px)', color: 'var(--danger)', opacity: .35, letterSpacing: '.2em' }}>NAMUNA</span></div>}
        </div>
    );
}
