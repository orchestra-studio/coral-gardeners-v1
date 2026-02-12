import { MetadataRoute } from 'next';
import { BRAND_CONFIG } from '@/config/brand.config';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: BRAND_CONFIG.manifest.name.en,
        short_name: BRAND_CONFIG.manifest.shortName.en,
        description: BRAND_CONFIG.meta.description.en,
        start_url: '/',
        display: BRAND_CONFIG.manifest.display,
        background_color: BRAND_CONFIG.manifest.backgroundColor,
        theme_color: BRAND_CONFIG.manifest.themeColor,
        icons: BRAND_CONFIG.manifest.icons,
    };
}
