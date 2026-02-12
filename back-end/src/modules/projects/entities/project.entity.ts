import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

// Translation structure for projects
export interface ProjectTranslation {
    name: string;
    description: string;
    environment: string;
}

// Supported languages type
export type SupportedLanguage = 'en' | 'ar';

// Translations object that maps language codes to their translations
export type ProjectTranslations = {
    [K in SupportedLanguage]: ProjectTranslation;
};

export type ProjectStatus = 'in-progress' | 'ready' | 'blocked';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    // Scalable translations column (JSON) - supports multiple languages
    @Column({ type: 'json' })
    translations: ProjectTranslations;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'in-progress',
    })
    status: ProjectStatus;

    @Column()
    version: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    icon_name: string;

    @Column({ nullable: true })
    admin_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    // Relation to admin who created this project
    @ManyToOne('Admin', { nullable: true })
    @JoinColumn({ name: 'admin_id' })
    admin?: any;

    // Helper method to get translation for a specific language
    getTranslation(lang: SupportedLanguage): ProjectTranslation {
        return this.translations[lang] || this.translations['en'];
    }

    // Helper method to get name for a specific language
    getName(lang: SupportedLanguage): string {
        return this.translations[lang]?.name || this.translations['en'].name;
    }

    // Helper method to get description for a specific language
    getDescription(lang: SupportedLanguage): string {
        return this.translations[lang]?.description || this.translations['en'].description;
    }

    // Helper method to get environment for a specific language
    getEnvironment(lang: SupportedLanguage): string {
        return this.translations[lang]?.environment || this.translations['en'].environment;
    }
}
