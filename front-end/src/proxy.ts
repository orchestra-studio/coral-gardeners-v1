import { type NextRequest, NextResponse } from 'next/server'

const locales = ["en", "ar"];
const defaultLocale = "en";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip proxy for API routes, static files, and assets
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Check if pathname has locale
    const hasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

    // If no locale, redirect to default locale
    if (!hasLocale) {
        const targetPath = pathname === '/' ? '/dashboard' : pathname;
        return NextResponse.redirect(new URL(`/${defaultLocale}${targetPath}`, request.url), { status: 307 });
    }

    // Get current locale and path without locale
    const currentLocale = pathname.split('/')[1]
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'

    // Redirect root to dashboard (auth will be handled client-side)
    if (pathWithoutLocale === '/') {
        return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url), { status: 307 });
    }

    // Note: Authentication is now handled entirely client-side via AuthGuard component
    // This is because proxy cannot access localStorage (Safari compatibility)

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
