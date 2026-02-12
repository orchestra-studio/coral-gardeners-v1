import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
    @IsOptional()
    @IsString()
    message?: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    provider: string;

    @IsArray()
    @IsNotEmpty()
    messages: Array<{
        role: string;
        content: string;
        blocks?: Array<{ type: string; content: any }>;
    }>;

    @IsOptional()
    @IsArray()
    history?: Array<{
        role: string;
        content: string;
        blocks?: Array<{ type: string; content: any }>;
    }>;

    @IsOptional()
    sessionId?: number;
}

export class CreateSessionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    model?: string;
}

export class UpdateSessionDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    is_archived?: boolean;
}
