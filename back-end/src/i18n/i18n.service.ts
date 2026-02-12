import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

type TranslationNamespace = 'common' | 'auth' | 'admin' | 'roles' | 'countries' | 'users' | 'project' | 'tasks' | 'settings';

@Injectable()
export class I18nService {
    private translations: Map<string, Record<string, string>> = new Map();
    private readonly supportedLocales = ['en', 'ar'];
    private readonly defaultLocale = 'en';

    constructor() {
        this.loadTranslations();
    }

    /**
     * Load all translation files into memory
     */
    private loadTranslations(): void {
        const translationsPath = path.join(__dirname, 'translations');

        this.supportedLocales.forEach((locale) => {
            const localePath = path.join(translationsPath, locale);

            if (fs.existsSync(localePath)) {
                const files = fs.readdirSync(localePath);

                files.forEach((file) => {
                    if (file.endsWith('.json')) {
                        const namespace = file.replace('.json', '');
                        const filePath = path.join(localePath, file);
                        const content = fs.readFileSync(filePath, 'utf-8');
                        const translations = JSON.parse(content);

                        const key = `${locale}:${namespace}`;
                        this.translations.set(key, translations);
                    }
                });
            } else {
                console.warn(`⚠️  Locale path not found: ${localePath}`);
            }
        });

    }

    /**
     * Get translation for a key
     * @param key - Translation key (e.g., 'login_success')
     * @param namespace - Translation namespace (e.g., 'auth', 'admin')
     * @param locale - Language locale (e.g., 'en', 'ar')
     * @param replacements - Object with replacement values for placeholders
     * @returns Translated string
     */
    t(
        key: string,
        namespace: TranslationNamespace = 'common',
        locale: string = this.defaultLocale,
        replacements?: Record<string, string | number>,
    ): string {
        // Normalize locale
        const normalizedLocale = this.normalizeLocale(locale);
        const translationKey = `${normalizedLocale}:${namespace}`;


        // Get translations for this locale and namespace
        const namespaceTranslations = this.translations.get(translationKey);

        if (!namespaceTranslations || !namespaceTranslations[key]) {

            // Fallback to default locale
            if (normalizedLocale !== this.defaultLocale) {
                const fallbackKey = `${this.defaultLocale}:${namespace}`;
                const fallbackTranslations = this.translations.get(fallbackKey);

                if (fallbackTranslations && fallbackTranslations[key]) {
                    return this.applyReplacements(fallbackTranslations[key], replacements);
                }
            }

            // Return the key itself if translation not found
            return key;
        }

        const translation = this.applyReplacements(namespaceTranslations[key], replacements);
        return translation;
    }

    /**
     * Normalize locale from Accept-Language header
     * Examples: "en-US" -> "en", "ar-SA" -> "ar", "fr-FR" -> "en" (fallback)
     */
    private normalizeLocale(locale: string): string {
        if (!locale) return this.defaultLocale;

        // Extract the primary language code (e.g., "en" from "en-US")
        const primaryLang = locale.split(',')[0].split('-')[0].split('_')[0].toLowerCase();

        // Check if we support this locale
        if (this.supportedLocales.includes(primaryLang)) {
            return primaryLang;
        }

        return this.defaultLocale;
    }

    /**
     * Apply replacements to translation string
     * Example: "Hello {name}" with {name: "John"} -> "Hello John"
     */
    private applyReplacements(
        text: string,
        replacements?: Record<string, string | number>,
    ): string {
        if (!replacements) return text;

        let result = text;
        Object.keys(replacements).forEach((key) => {
            const placeholder = `{${key}}`;
            result = result.replace(new RegExp(placeholder, 'g'), String(replacements[key]));
        });

        return result;
    }

    /**
     * Get current locale from Accept-Language header
     */
    extractLocaleFromHeader(acceptLanguageHeader?: string): string {
        if (!acceptLanguageHeader) return this.defaultLocale;
        return this.normalizeLocale(acceptLanguageHeader);
    }
}
