import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system',
}

export class MessageDto {
    @IsNotEmpty()
    @IsEnum(MessageRole)
    role: MessageRole;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    blocks?: any[];
}

export class SaveMessagesDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => MessageDto)
    messages: MessageDto[];
}
