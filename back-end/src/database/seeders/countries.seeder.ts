import { DataSource } from 'typeorm';
import { Country } from '../../modules/helpers/countries/country.entity';

/**
 * Countries Seeder
 * Seeds countries with multilingual names (Arabic/English)
 */
export async function seedCountries(dataSource: DataSource) {
    console.log('🌍 Seeding countries...');

    const countryRepository = dataSource.getRepository(Country);

    try {
        const countries = [
            { code: 'DZ', name: { ar: 'الجزائر', en: 'Algeria' }, phone_code: '+213' },
            { code: 'US', name: { ar: 'الولايات المتحدة', en: 'United States' }, phone_code: '+1' },
            { code: 'GB', name: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, phone_code: '+44' },
            { code: 'FR', name: { ar: 'فرنسا', en: 'France' }, phone_code: '+33' },
            { code: 'DE', name: { ar: 'ألمانيا', en: 'Germany' }, phone_code: '+49' },
            { code: 'SA', name: { ar: 'السعودية', en: 'Saudi Arabia' }, phone_code: '+966' },
            { code: 'AE', name: { ar: 'الإمارات', en: 'United Arab Emirates' }, phone_code: '+971' },
            { code: 'EG', name: { ar: 'مصر', en: 'Egypt' }, phone_code: '+20' },
            { code: 'MA', name: { ar: 'المغرب', en: 'Morocco' }, phone_code: '+212' },
            { code: 'TN', name: { ar: 'تونس', en: 'Tunisia' }, phone_code: '+216' },
            { code: 'LY', name: { ar: 'ليبيا', en: 'Libya' }, phone_code: '+218' },
            { code: 'SD', name: { ar: 'السودان', en: 'Sudan' }, phone_code: '+249' },
            { code: 'IQ', name: { ar: 'العراق', en: 'Iraq' }, phone_code: '+964' },
            { code: 'SY', name: { ar: 'سوريا', en: 'Syria' }, phone_code: '+963' },
            { code: 'LB', name: { ar: 'لبنان', en: 'Lebanon' }, phone_code: '+961' },
            { code: 'JO', name: { ar: 'الأردن', en: 'Jordan' }, phone_code: '+962' },
            { code: 'PS', name: { ar: 'فلسطين', en: 'Palestine' }, phone_code: '+970' },
            { code: 'KW', name: { ar: 'الكويت', en: 'Kuwait' }, phone_code: '+965' },
            { code: 'QA', name: { ar: 'قطر', en: 'Qatar' }, phone_code: '+974' },
            { code: 'BH', name: { ar: 'البحرين', en: 'Bahrain' }, phone_code: '+973' },
            { code: 'OM', name: { ar: 'عمان', en: 'Oman' }, phone_code: '+968' },
            { code: 'YE', name: { ar: 'اليمن', en: 'Yemen' }, phone_code: '+967' },
            { code: 'CA', name: { ar: 'كندا', en: 'Canada' }, phone_code: '+1' },
            { code: 'AU', name: { ar: 'أستراليا', en: 'Australia' }, phone_code: '+61' },
            { code: 'IT', name: { ar: 'إيطاليا', en: 'Italy' }, phone_code: '+39' },
            { code: 'ES', name: { ar: 'إسبانيا', en: 'Spain' }, phone_code: '+34' },
            { code: 'NL', name: { ar: 'هولندا', en: 'Netherlands' }, phone_code: '+31' },
            { code: 'BE', name: { ar: 'بلجيكا', en: 'Belgium' }, phone_code: '+32' },
            { code: 'CH', name: { ar: 'سويسرا', en: 'Switzerland' }, phone_code: '+41' },
            { code: 'SE', name: { ar: 'السويد', en: 'Sweden' }, phone_code: '+46' },
            { code: 'NO', name: { ar: 'النرويج', en: 'Norway' }, phone_code: '+47' },
            { code: 'DK', name: { ar: 'الدنمارك', en: 'Denmark' }, phone_code: '+45' },
            { code: 'FI', name: { ar: 'فنلندا', en: 'Finland' }, phone_code: '+358' },
            { code: 'TR', name: { ar: 'تركيا', en: 'Turkey' }, phone_code: '+90' },
            { code: 'IN', name: { ar: 'الهند', en: 'India' }, phone_code: '+91' },
            { code: 'CN', name: { ar: 'الصين', en: 'China' }, phone_code: '+86' },
            { code: 'JP', name: { ar: 'اليابان', en: 'Japan' }, phone_code: '+81' },
            { code: 'KR', name: { ar: 'كوريا الجنوبية', en: 'South Korea' }, phone_code: '+82' },
            { code: 'BR', name: { ar: 'البرازيل', en: 'Brazil' }, phone_code: '+55' },
            { code: 'MX', name: { ar: 'المكسيك', en: 'Mexico' }, phone_code: '+52' },
            { code: 'AR', name: { ar: 'الأرجنتين', en: 'Argentina' }, phone_code: '+54' },
            { code: 'ZA', name: { ar: 'جنوب أفريقيا', en: 'South Africa' }, phone_code: '+27' },
            { code: 'NG', name: { ar: 'نيجيريا', en: 'Nigeria' }, phone_code: '+234' },
            { code: 'KE', name: { ar: 'كينيا', en: 'Kenya' }, phone_code: '+254' },
            { code: 'PK', name: { ar: 'باكستان', en: 'Pakistan' }, phone_code: '+92' },
            { code: 'BD', name: { ar: 'بنغلاديش', en: 'Bangladesh' }, phone_code: '+880' },
            { code: 'MY', name: { ar: 'ماليزيا', en: 'Malaysia' }, phone_code: '+60' },
            { code: 'SG', name: { ar: 'سنغافورة', en: 'Singapore' }, phone_code: '+65' },
            { code: 'TH', name: { ar: 'تايلاند', en: 'Thailand' }, phone_code: '+66' },
            { code: 'VN', name: { ar: 'فيتنام', en: 'Vietnam' }, phone_code: '+84' },
        ];

        for (const countryData of countries) {
            // Check if country already exists
            const existing = await countryRepository.findOne({
                where: { code: countryData.code }
            });

            if (!existing) {
                const country = countryRepository.create(countryData);
                await countryRepository.save(country);
            }
        }

        console.log(`✅ ${countries.length} countries seeded successfully\n`);
    } catch (error) {
        console.error('❌ Error seeding countries:', error);
        throw error;
    }
}

// Standalone execution
if (require.main === module) {
    import('dotenv').then((dotenv) => dotenv.config());
    import('../config/database.config').then(({ getDatabaseConfig }) => {
        const AppDataSource = new DataSource(getDatabaseConfig());

        (async () => {
            try {
                await AppDataSource.initialize();
                console.log('📦 Database connection established\n');

                await seedCountries(AppDataSource);

                console.log('🎉 Countries seeding completed successfully!');
            } catch (error) {
                console.error('❌ Seeding error:', error.message);
                process.exit(1);
            } finally {
                await AppDataSource.destroy();
            }
        })();
    });
}
