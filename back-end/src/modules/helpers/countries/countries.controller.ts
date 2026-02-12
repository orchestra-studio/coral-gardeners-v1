import { Controller, Get, Headers } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('helpers')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) { }

    /**
     * GET /api/helpers/countries
     * Get countries in select format with localized labels
     */
    @Get('countries')
    async getCountriesForSelect(@Headers('accept-language') locale: string) {
        const countries = await this.countriesService.findAll();

        // Extract the primary language code (en or ar)
        const lang = locale?.split(',')[0]?.split('-')[0]?.toLowerCase() || 'en';
        const normalizedLang = ['en', 'ar'].includes(lang) ? lang : 'en';

        // Transform to select format with localized labels
        const data = countries.map(country => ({
            value: country.id,
            label: country.name[normalizedLang] || country.name['en'],
            code: country.code,
            phone_code: country.phone_code,
        }));

        return data;
    }
}
