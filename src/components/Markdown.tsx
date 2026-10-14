import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* eslint-disable @typescript-eslint/no-explicit-any */
type HNode = { type: string; tagName?: string; value?: string; properties?: Record<string, any>; children?: HNode[] };

export function slugify(s: string) {
    return s.toLowerCase().replace(/[‘’ʻʼ'"“”«»]/g, '').replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'bolim';
}
const textOf = (n: HNode): string => (n.type === 'text' ? n.value || '' : (n.children || []).map(textOf).join(''));

/** h2 sarlavhalarga id; “> [!NOTE] Sarlavha” bloklarini rangli eslatmaga aylantirish; jadvallarni o‘rash. */
function rehypeLesson() {
    return (tree: HNode) => {
        const used = new Set<string>();
        const walk = (node: HNode, parent?: HNode) => {
            if (node.type === 'element' && node.tagName === 'h2') {
                let id = slugify(textOf(node)), k = 2;
                while (used.has(id)) id = `${slugify(textOf(node))}-${k++}`;
                used.add(id);
                node.properties = { ...node.properties, id };
            }
            if (node.type === 'element' && node.tagName === 'blockquote') {
                const p = node.children?.find(c => c.type === 'element' && c.tagName === 'p');
                const first = p?.children?.[0];
                const m = first?.type === 'text' ? /^\[!(NOTE|TIP|WARNING)\]\s*([^\n]*)\n?/.exec(first.value || '') : null;
                if (p && first && m) {
                    first.value = (first.value || '').slice(m[0].length);
                    node.properties = { ...node.properties, className: [m[1].toLowerCase()] };
                    if (m[2]) p.children!.unshift({ type: 'element', tagName: 'b', properties: { className: ['co-title'] }, children: [{ type: 'text', value: m[2] }] });
                }
            }
            if (node.type === 'element' && node.tagName === 'table' && parent && !(parent.properties?.className || []).includes('table-wrap')) {
                const idx = parent.children!.indexOf(node);
                parent.children![idx] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [node] };
                return;
            }
            (node.children || []).slice().forEach(c => walk(c, node));
        };
        walk(tree);
    };
}

export function Markdown({ children }: { children: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeLesson as any]}
            components={{
                a: ({ href, children: c }) => {
                    const ext = href && /^https?:/.test(href);
                    return <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{c}</a>;
                }
            }}
        >
            {children}
        </ReactMarkdown>
    );
}

/** Mundarija uchun h2 sarlavhalari (Markdown’dan). */
export function headingsOf(md: string) {
    const used = new Set<string>();
    return md.split('\n').filter(l => /^##\s+/.test(l)).map(l => {
        const text = l.replace(/^##\s+/, '').replace(/[*_`]/g, '').trim();
        let id = slugify(text), k = 2;
        while (used.has(id)) id = `${slugify(text)}-${k++}`;
        used.add(id);
        return { id, text };
    });
}
