import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @MaxLength(255)
    text: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}

export class UpdateTaskDto {
    @IsString()
    @MaxLength(255)
    @IsOptional()
    text?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}
