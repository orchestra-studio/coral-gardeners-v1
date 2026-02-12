import { MetadataRoute } from 'next';
import { BRAND_CONFIG } from '@/config/brand.config';

type Params = Promise<{ locale: string }>;

export default async function manifest(
    { params }: { params: Params }
): Promise<MetadataRoute.Manifest> {
    const { locale } = await params;
    const isArabic = locale === 'ar';

    return {
        name: isArabic ? BRAND_CONFIG.manifest.name.ar : BRAND_CONFIG.manifest.name.en,
        short_name: isArabic ? BRAND_CONFIG.manifest.shortName.ar : BRAND_CONFIG.manifest.shortName.en,
        description: isArabic ? BRAND_CONFIG.meta.description.ar : BRAND_CONFIG.meta.description.en,
        start_url: `/${locale}`,
        display: BRAND_CONFIG.manifest.display,
        background_color: BRAND_CONFIG.manifest.backgroundColor,
        theme_color: BRAND_CONFIG.manifest.themeColor,
        dir: isArabic ? 'rtl' : 'ltr',
        lang: locale,
        icons: BRAND_CONFIG.manifest.icons,
    };
}
