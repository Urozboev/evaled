import { NextResponse, type NextRequest } from 'next/server';

/** Joriy yo‘lni server komponentlariga uzatadi (login’dan keyin qaytish uchun). */
export function proxy(req: NextRequest) {
    const h = new Headers(req.headers);
    h.set('x-pathname', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.next({ request: { headers: h } });
}

export const config = {
    matcher: ['/((?!_next/|favicon|.*\\.(?:png|jpg|svg|ico|webp|css|js|woff2?)$).*)']
};
