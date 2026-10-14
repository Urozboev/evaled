import { NetBg } from './ui';

export function AuthShell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
    return (
        <div className="auth-wrap">
            <aside className="auth-side">
                <NetBg seed={21} />
                <h2>Baholash kompetensiyangizni bosqichma-bosqich rivojlantiring</h2>
                <p>Bo‘lajak boshlang‘ich sinf o‘qituvchilari uchun o‘quv-metodik platforma</p>
                <ul>
                    <li><i className="fas fa-book-open" />8 ta nazariy dars va mavzu testlari</li>
                    <li><i className="fas fa-puzzle-piece" />Interaktiv mashqlar va pedagogik vaziyatlar</li>
                    <li><i className="fas fa-children" />Virtual boshlang‘ich sinf simulyatorlari</li>
                    <li><i className="fas fa-chart-line" />Natijalaringiz saqlanadi — istalgan qurilmadan davom eting</li>
                    <li><i className="fas fa-award" />Kurs yakunida sertifikat</li>
                </ul>
            </aside>
            <div className="auth-main">
                <div className="auth-card">
                    <h1>{title}</h1>
                    <p className="muted">{lead}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}
