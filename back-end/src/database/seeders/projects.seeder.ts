import { DataSource } from 'typeorm';
import { Project } from '../../modules/projects/entities/project.entity';

export const seedProjects = async (dataSource: DataSource) => {
    const projectRepository = dataSource.getRepository(Project);

    console.log('🌱 Seeding projects...');

    let adminResult = await dataSource.query('SELECT id FROM admins WHERE email = ? LIMIT 1', ['admin@example.com']);
    let adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
    if (!adminId) {
        adminResult = await dataSource.query('SELECT id FROM admins ORDER BY id ASC LIMIT 1');
        adminId = adminResult && adminResult.length > 0 ? adminResult[0].id : null;
    }

    const projects = [
        {
            translations: {
                en: {
                    name: 'E-Commerce Platform',
                    description: 'Complete online store with payment integration and inventory management',
                    environment: 'Production',
                },
                ar: {
                    name: 'منصة التجارة الإلكترونية',
                    description: 'متجر إلكتروني كامل مع تكامل الدفع وإدارة المخزون',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.1',
            icon_name: 'code',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Mobile App (iOS & Android)',
                    description: 'Cross-platform mobile application with push notifications',
                    environment: 'Production',
                },
                ar: {
                    name: 'تطبيق الهاتف (iOS و Android)',
                    description: 'تطبيق جوال متعدد المنصات مع إشعارات الدفع',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.3',
            icon_name: 'mobile',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Dashboard Analytics',
                    description: 'Real-time business intelligence dashboard with data visualization',
                    environment: 'Development',
                },
                ar: {
                    name: 'لوحة التحليلات',
                    description: 'لوحة معلومات ذكاء الأعمال في الوقت الفعلي مع تصور البيانات',
                    environment: 'التطوير',
                },
            },
            status: 'in-progress' as const,
            version: 'v3.0',
            icon_name: 'react',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'API Gateway Service',
                    description: 'Microservices architecture with GraphQL and REST APIs',
                    environment: 'Production',
                },
                ar: {
                    name: 'خدمة بوابة API',
                    description: 'بنية الخدمات الصغيرة مع GraphQL و REST APIs',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.8',
            icon_name: 'cloud',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Database Migration',
                    description: 'PostgreSQL to MongoDB migration with data transformation',
                    environment: 'Staging',
                },
                ar: {
                    name: 'ترحيل قاعدة البيانات',
                    description: 'مشروع الترحيل من PostgreSQL إلى MongoDB مع تحويل البيانات',
                    environment: 'التجهيز',
                },
            },
            status: 'ready' as const,
            version: 'v1.2',
            icon_name: 'database',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Content Management System',
                    description: 'Headless CMS with multi-language support',
                    environment: 'Production',
                },
                ar: {
                    name: 'نظام إدارة المحتوى',
                    description: 'نظام إدارة محتوى بدون رأس مع دعم متعدد اللغات',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.5',
            icon_name: 'layout',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'AI Chatbot Integration',
                    description: 'Customer service chatbot with NLP capabilities',
                    environment: 'Development',
                },
                ar: {
                    name: 'تكامل روبوت الدردشة بالذكاء الاصطناعي',
                    description: 'روبوت دردشة خدمة العملاء مع قدرات معالجة اللغة الطبيعية',
                    environment: 'التطوير',
                },
            },
            status: 'in-progress' as const,
            version: 'v0.9',
            icon_name: 'brain',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Payment Gateway',
                    description: 'Multi-currency payment processing system',
                    environment: 'Production',
                },
                ar: {
                    name: 'بوابة الدفع',
                    description: 'نظام معالجة الدفع متعدد العملات',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v3.2',
            icon_name: 'credit-card',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Video Streaming Platform',
                    description: 'Live and on-demand video streaming service',
                    environment: 'Staging',
                },
                ar: {
                    name: 'منصة بث الفيديو',
                    description: 'خدمة بث الفيديو المباشر وعند الطلب',
                    environment: 'التجهيز',
                },
            },
            status: 'in-progress' as const,
            version: 'v1.0',
            icon_name: 'video',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Social Media Integration',
                    description: 'Multi-platform social media management tool',
                    environment: 'Production',
                },
                ar: {
                    name: 'تكامل وسائل التواصل الاجتماعي',
                    description: 'أداة إدارة وسائل التواصل الاجتماعي متعددة المنصات',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.3',
            icon_name: 'share',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Inventory Management',
                    description: 'Real-time inventory tracking and warehouse management',
                    environment: 'Production',
                },
                ar: {
                    name: 'إدارة المخزون',
                    description: 'تتبع المخزون في الوقت الفعلي وإدارة المستودعات',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.7',
            icon_name: 'package',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Customer Loyalty Program',
                    description: 'Points-based rewards and loyalty tracking system',
                    environment: 'Development',
                },
                ar: {
                    name: 'برنامج ولاء العملاء',
                    description: 'نظام المكافآت القائم على النقاط وتتبع الولاء',
                    environment: 'التطوير',
                },
            },
            status: 'in-progress' as const,
            version: 'v0.8',
            icon_name: 'gift',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Email Marketing Campaign',
                    description: 'Automated email campaigns with analytics',
                    environment: 'Production',
                },
                ar: {
                    name: 'حملة التسويق عبر البريد الإلكتروني',
                    description: 'حملات البريد الإلكتروني الآلية مع التحليلات',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.0',
            icon_name: 'mail',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Booking & Reservation System',
                    description: 'Online appointment scheduling and booking platform',
                    environment: 'Staging',
                },
                ar: {
                    name: 'نظام الحجز والحجوزات',
                    description: 'منصة جدولة المواعيد والحجز عبر الإنترنت',
                    environment: 'التجهيز',
                },
            },
            status: 'in-progress' as const,
            version: 'v1.4',
            icon_name: 'calendar',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        {
            translations: {
                en: {
                    name: 'Security & Authentication',
                    description: 'Multi-factor authentication and security framework',
                    environment: 'Production',
                },
                ar: {
                    name: 'الأمان والمصادقة',
                    description: 'إطار عمل المصادقة متعددة العوامل والأمان',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v3.1',
            icon_name: 'shield',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
        },
        // Deleted projects (12)
        {
            translations: {
                en: {
                    name: 'Legacy CRM System',
                    description: 'Old customer relationship management system - migrated to new platform',
                    environment: 'Production',
                },
                ar: {
                    name: 'نظام CRM القديم',
                    description: 'نظام إدارة علاقات العملاء القديم - تم الترحيل إلى منصة جديدة',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.1',
            icon_name: 'users',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Old Blog Platform',
                    description: 'Deprecated blogging system replaced by headless CMS',
                    environment: 'Production',
                },
                ar: {
                    name: 'منصة المدونة القديمة',
                    description: 'نظام التدوين المهمل الذي تم استبداله بنظام إدارة المحتوى',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.5',
            icon_name: 'book',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Prototype Testing App',
                    description: 'Initial prototype - testing completed, no longer needed',
                    environment: 'Development',
                },
                ar: {
                    name: 'تطبيق اختبار النموذج الأولي',
                    description: 'النموذج الأولي - تم الانتهاء من الاختبار، لم يعد مطلوباً',
                    environment: 'التطوير',
                },
            },
            status: 'in-progress' as const,
            version: 'v0.5',
            icon_name: 'flask',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Old API v1',
                    description: 'Deprecated API version 1 - migrated to v2',
                    environment: 'Production',
                },
                ar: {
                    name: 'API القديم v1',
                    description: 'إصدار API المهمل 1 - تم الترحيل إلى v2',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.0',
            icon_name: 'api',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Manual Reporting Tool',
                    description: 'Replaced by automated analytics dashboard',
                    environment: 'Production',
                },
                ar: {
                    name: 'أداة التقارير اليدوية',
                    description: 'تم استبدالها بلوحة التحليلات الآلية',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.8',
            icon_name: 'file-text',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Beta Mobile App',
                    description: 'Beta version discontinued after official release',
                    environment: 'Staging',
                },
                ar: {
                    name: 'تطبيق الجوال التجريبي',
                    description: 'تم إيقاف النسخة التجريبية بعد الإصدار الرسمي',
                    environment: 'التجهيز',
                },
            },
            status: 'in-progress' as const,
            version: 'v0.9',
            icon_name: 'smartphone',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Old File Storage',
                    description: 'Legacy file storage migrated to cloud solution',
                    environment: 'Production',
                },
                ar: {
                    name: 'تخزين الملفات القديم',
                    description: 'تم ترحيل تخزين الملفات القديم إلى حل سحابي',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.3',
            icon_name: 'folder',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Temporary Landing Page',
                    description: 'Temporary campaign landing page - campaign ended',
                    environment: 'Production',
                },
                ar: {
                    name: 'صفحة الهبوط المؤقتة',
                    description: 'صفحة الهبوط المؤقتة للحملة - انتهت الحملة',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v1.0',
            icon_name: 'layout',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Internal Survey Tool',
                    description: 'One-time employee survey tool - no longer needed',
                    environment: 'Development',
                },
                ar: {
                    name: 'أداة الاستطلاع الداخلي',
                    description: 'أداة استطلاع الموظفين لمرة واحدة - لم يعد مطلوباً',
                    environment: 'التطوير',
                },
            },
            status: 'ready' as const,
            version: 'v1.2',
            icon_name: 'clipboard',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Old Forum Platform',
                    description: 'Community forum replaced by modern discussion board',
                    environment: 'Production',
                },
                ar: {
                    name: 'منصة المنتدى القديمة',
                    description: 'منتدى المجتمع تم استبداله بلوحة نقاش حديثة',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v3.2',
            icon_name: 'message-circle',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Legacy Search Engine',
                    description: 'Old search functionality replaced by Elasticsearch',
                    environment: 'Production',
                },
                ar: {
                    name: 'محرك البحث القديم',
                    description: 'وظيفة البحث القديمة تم استبدالها بـ Elasticsearch',
                    environment: 'الإنتاج',
                },
            },
            status: 'ready' as const,
            version: 'v2.0',
            icon_name: 'search',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
        {
            translations: {
                en: {
                    name: 'Pilot Program Dashboard',
                    description: 'Pilot program dashboard - program concluded',
                    environment: 'Staging',
                },
                ar: {
                    name: 'لوحة البرنامج التجريبي',
                    description: 'لوحة البرنامج التجريبي - تم إنهاء البرنامج',
                    environment: 'التجهيز',
                },
            },
            status: 'in-progress' as const,
            version: 'v1.1',
            icon_name: 'trending-up',
            image: '/assets/images/project/project.png',
            admin_id: adminId,
            deleted_at: new Date(),
        },
    ];

    await projectRepository.save(projects);
    console.log('✅ Projects seeded successfully');
};

