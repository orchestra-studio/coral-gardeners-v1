import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSessionDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsString()
    provider: string;
}
