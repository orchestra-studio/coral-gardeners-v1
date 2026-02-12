import { Injectable } from '@nestjs/common';

/**
 * Tool Argument Validator Service
 * Validates and parses tool arguments using Zod schemas
 */
@Injectable()
export class ToolArgumentValidatorService {
    /**
     * Validate tool arguments against schema
     */
    validateArguments(args: any, schema: any): { success: boolean; data?: any; error?: string } {
        // If no schema provided, return args as-is
        if (!schema) {
            return {
                success: true,
                data: args ?? {},
            };
        }

        // Validate using Zod schema
        const validation = schema.safeParse(args ?? {});

        if (!validation.success) {
            return {
                success: false,
                error: `Invalid tool arguments: ${validation.error.message}`,
            };
        }

        return {
            success: true,
            data: validation.data,
        };
    }
}
