'use client'

import { useParams } from 'next/navigation'
import { Locale } from '@/config/i18n'

export function useLocale(): Locale {
    const params = useParams()
    const localeParam = params?.locale as string

    // Validate and return the locale from URL, default to 'en'
    if (localeParam && ['en', 'fr', 'es', 'ar'].includes(localeParam)) {
        return localeParam as Locale
    }

    return 'en'
}
