import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password_confirmation: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    profile_picture?: string;

    @IsOptional()
    @IsString()
    phone_code?: string;

    @IsOptional()
    @IsNumber()
    country_id?: number;
}

export class UpdateAdminDto {
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
    password_confirmation?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    profile_picture?: string;

    @IsOptional()
    @IsNumber()
    country_id?: number;
}

export class UpdateAdminRolesDto {
    @IsArray()
    @IsNumber({}, { each: true })
    role_ids: number[];
}

export class LoginDto {
    @IsEmail({}, { message: 'email_invalid' })
    @IsNotEmpty({ message: 'email_required' })
    email: string;

    @IsString({ message: 'password_invalid' })
    @IsNotEmpty({ message: 'password_required' })
    password: string;
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    current_password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password_confirmation: string;
}
