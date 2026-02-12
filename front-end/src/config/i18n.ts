import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

// Helper function to load specific message namespaces
export async function getMessagesForNamespaces(locale: string, namespaces: string[]) {
    const validLocale = locale && locales.includes(locale as Locale) ? locale : 'en';
    const messages: Record<string, Record<string, string>> = {};

    for (const namespace of namespaces) {
        try {
            const moduleMessages = await import(`../../messages/${namespace}/${validLocale}.json`);
            messages[namespace] = moduleMessages.default;
        } catch {
            console.warn(`Could not load messages for namespace '${namespace}' and locale '${validLocale}'`);
            messages[namespace] = {};
        }
    }

    return messages;
}

// Default configuration - only loads layouts (for global components like navbar)
export default getRequestConfig(async ({ locale }) => {
    const validLocale = locale && locales.includes(locale as Locale) ? locale : 'en';

    // By default, only load layouts messages (navbar, footer, etc.)
    const layoutsMessages = await import(`../../messages/layouts/${validLocale}.json`)
        .then(m => m.default)
        .catch(() => ({}));

    return {
        locale: validLocale,
        messages: {
            layouts: layoutsMessages
        }
    }
})
