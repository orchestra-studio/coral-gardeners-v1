import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateAppSettingDto {
    @IsNotEmpty()
    @IsString()
    value: string;
}

export class CreateAppSettingDto {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsOptional()
    display_name?: { en: string; ar: string };

    @IsOptional()
    description?: { en: string; ar: string };

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    category?: string;
}
