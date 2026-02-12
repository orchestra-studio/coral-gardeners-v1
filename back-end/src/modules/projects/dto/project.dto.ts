import { IsString, IsEnum, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectTranslations, ProjectTranslation } from '../entities/project.entity';

class ProjectTranslationDto implements ProjectTranslation {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    description: string;

    @IsString()
    @MaxLength(100)
    environment: string;
}

class ProjectTranslationsDto implements ProjectTranslations {
    @ValidateNested()
    @Type(() => ProjectTranslationDto)
    en: ProjectTranslationDto;

    @ValidateNested()
    @Type(() => ProjectTranslationDto)
    ar: ProjectTranslationDto;
}

export class CreateProjectDto {
    @ValidateNested()
    @Type(() => ProjectTranslationsDto)
    translations: ProjectTranslationsDto;

    @IsEnum(['in-progress', 'ready', 'blocked'])
    status: 'in-progress' | 'ready' | 'blocked';

    @IsString()
    @MaxLength(50)
    version: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    icon_name?: string;
}

export class UpdateProjectDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => ProjectTranslationsDto)
    translations?: ProjectTranslationsDto;

    @IsOptional()
    @IsEnum(['in-progress', 'ready', 'blocked'])
    status?: 'in-progress' | 'ready' | 'blocked';

    @IsOptional()
    @IsString()
    @MaxLength(50)
    version?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    icon_name?: string;
}

