import { DataSource } from 'typeorm';
import { AppSetting } from '../../modules/settings/entities/app-setting.entity';

export async function seedAppSettings(dataSource: DataSource): Promise<void> {
    const appSettingRepository = dataSource.getRepository(AppSetting);

    let adminResult = await dataSource.query('SELECT id FROM admins WHERE email = ? LIMIT 1', ['admin@example.com']);
    let adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
    if (!adminId) {
        adminResult = await dataSource.query('SELECT id FROM admins ORDER BY id ASC LIMIT 1');
        adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
    }

    const settings = [
        // Payment Settings
        {
            key: 'stripe_fees_percentage',
            value: '2.9',
            display_name: {
                en: 'Stripe Fees Percentage',
                ar: 'نسبة رسوم سترايب',
            },
            description: {
                en: 'Stripe payment processing fee percentage',
                ar: 'نسبة رسوم معالجة الدفع عبر سترايب',
            },
            type: 'number',
            category: 'payment',
            admin_id: adminId,
        },
        {
            key: 'stripe_fixed_fee',
            value: '0.30',
            display_name: {
                en: 'Stripe Fixed Fee',
                ar: 'رسوم سترايب الثابتة',
            },
            description: {
                en: 'Stripe fixed fee per transaction (in USD)',
                ar: 'رسوم سترايب الثابتة لكل معاملة (بالدولار)',
            },
            type: 'number',
            category: 'payment',
            admin_id: adminId,
        },
        {
            key: 'platform_commission_percentage',
            value: '15',
            display_name: {
                en: 'Platform Commission',
                ar: 'عمولة المنصة',
            },
            description: {
                en: 'Platform commission percentage on transactions',
                ar: 'نسبة عمولة المنصة على المعاملات',
            },
            type: 'number',
            category: 'payment',
            admin_id: adminId,
        },

        // Withdrawal Settings
        {
            key: 'minimum_withdrawal_amount',
            value: '50',
            display_name: {
                en: 'Minimum Withdrawal Amount',
                ar: 'الحد الأدنى للسحب',
            },
            description: {
                en: 'Minimum amount required for withdrawal (in USD)',
                ar: 'الحد الأدنى المطلوب للسحب (بالدولار)',
            },
            type: 'number',
            category: 'withdrawal',
            admin_id: adminId,
        },
        {
            key: 'maximum_withdrawal_amount',
            value: '10000',
            display_name: {
                en: 'Maximum Withdrawal Amount',
                ar: 'الحد الأقصى للسحب',
            },
            description: {
                en: 'Maximum amount allowed per withdrawal (in USD)',
                ar: 'الحد الأقصى المسموح به لكل عملية سحب (بالدولار)',
            },
            type: 'number',
            category: 'withdrawal',
            admin_id: adminId,
        },
        {
            key: 'withdrawal_processing_days',
            value: '7',
            display_name: {
                en: 'Withdrawal Processing Days',
                ar: 'أيام معالجة السحب',
            },
            description: {
                en: 'Number of business days to process withdrawal requests',
                ar: 'عدد أيام العمل لمعالجة طلبات السحب',
            },
            type: 'number',
            category: 'withdrawal',
            admin_id: adminId,
        },

        // Email Settings
        {
            key: 'support_email',
            value: 'support@example.com',
            display_name: {
                en: 'Support Email',
                ar: 'بريد الدعم',
            },
            description: {
                en: 'Email address for customer support',
                ar: 'عنوان البريد الإلكتروني لدعم العملاء',
            },
            type: 'text',
            category: 'email',
            admin_id: adminId,
        },
        {
            key: 'notification_email',
            value: 'notifications@example.com',
            display_name: {
                en: 'Notification Email',
                ar: 'بريد الإشعارات',
            },
            description: {
                en: 'Email address for system notifications',
                ar: 'عنوان البريد الإلكتروني لإشعارات النظام',
            },
            type: 'text',
            category: 'email',
            admin_id: adminId,
        },

        // General Settings
        {
            key: 'site_name',
            value: 'Dashboard Platform',
            display_name: {
                en: 'Site Name',
                ar: 'اسم الموقع',
            },
            description: {
                en: 'Name of the platform',
                ar: 'اسم المنصة',
            },
            type: 'text',
            category: 'general',
            admin_id: adminId,
        },
        {
            key: 'site_tagline',
            value: 'Manage Your Business',
            display_name: {
                en: 'Site Tagline',
                ar: 'شعار الموقع',
            },
            description: {
                en: 'Platform tagline or motto',
                ar: 'شعار أو عبارة المنصة',
            },
            type: 'text',
            category: 'general',
            admin_id: adminId,
        },
        {
            key: 'maintenance_mode',
            value: 'false',
            display_name: {
                en: 'Maintenance Mode',
                ar: 'وضع الصيانة',
            },
            description: {
                en: 'Enable maintenance mode to disable public access',
                ar: 'تفعيل وضع الصيانة لتعطيل الوصول العام',
            },
            type: 'boolean',
            category: 'general',
            admin_id: adminId,
        },

        // Feature Flags
        {
            key: 'referral_program_enabled',
            value: 'false',
            display_name: {
                en: 'Referral Program Enabled',
                ar: 'برنامج الإحالة مفعل',
            },
            description: {
                en: 'Enable or disable the referral program',
                ar: 'تفعيل أو تعطيل برنامج الإحالة',
            },
            type: 'boolean',
            category: 'features',
            admin_id: adminId,
        },
        {
            key: 'referral_bonus_percentage',
            value: '10',
            display_name: {
                en: 'Referral Bonus Percentage',
                ar: 'نسبة مكافأة الإحالة',
            },
            description: {
                en: 'Percentage bonus for successful referrals',
                ar: 'نسبة المكافأة للإحالات الناجحة',
            },
            type: 'number',
            category: 'features',
            admin_id: adminId,
        },
    ];

    console.log('\n⚙️  Seeding app settings...');

    for (const settingData of settings) {
        const existingSetting = await appSettingRepository.findOne({
            where: { key: settingData.key },
        });

        if (existingSetting) {
            // Update existing setting
            await appSettingRepository.update(existingSetting.id, settingData);
        } else {
            // Create new setting
            const setting = appSettingRepository.create(settingData);
            await appSettingRepository.save(setting);
        }
    }

    console.log('✅ App settings seeding completed\n');
}
