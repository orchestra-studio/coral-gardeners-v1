import { IsEmail, IsOptional, IsString, MinLength, IsNumber, IsDate } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    profile_picture?: string;

    @IsOptional()
    @IsNumber()
    country_id?: number;

    @IsOptional()
    @IsDate()
    email_verified_at?: Date | null;
}
