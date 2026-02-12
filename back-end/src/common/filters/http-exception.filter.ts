import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from '../../i18n/i18n.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Get locale from Accept-Language header
        const locale = (request.headers as any)['accept-language'] || 'en';

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = this.i18n.t('internal_error', 'common', locale);
        let errors: Record<string, string[]> | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            let isTranslated = false;

            if (typeof exceptionResponse === 'string') {
                const translated = this.translateMessage(exceptionResponse, locale);
                isTranslated = translated !== exceptionResponse;
                message = translated;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || message;
                errors = responseObj.errors;

                // Handle validation errors
                if (Array.isArray(responseObj.message)) {
                    const translatedMessages = responseObj.message.map((msg: string) =>
                        this.translateMessage(msg, locale),
                    );
                    message = translatedMessages[0] || this.i18n.t('validation_failed', 'common', locale);
                    isTranslated = translatedMessages.some((translated: string, index: number) =>
                        translated !== responseObj.message[index],
                    );
                    errors = this.formatValidationErrors(responseObj.message, locale);
                }
                // Check if message is a translation key
                else if (typeof responseObj.message === 'string') {
                    const translated = this.translateMessage(responseObj.message, locale);
                    isTranslated = translated !== responseObj.message;
                    message = translated;
                }
            }

            // Translate common HTTP errors only if message wasn't already translated
            if (status === HttpStatus.UNAUTHORIZED && !isTranslated) {
                message = this.i18n.t('unauthorized', 'common', locale);
            } else if (status === HttpStatus.FORBIDDEN && !isTranslated) {
                message = this.i18n.t('forbidden', 'common', locale);
            } else if (status === HttpStatus.NOT_FOUND && !isTranslated) {
                message = this.i18n.t('not_found', 'common', locale);
            }
        }

        response.status(status).json({
            success: false,
            data: null,
            message,
            errors,
        });
    }

    /**
     * Format class-validator errors into our error structure
     */
    private formatValidationErrors(messages: string[], locale: string): Record<string, string[]> {
        const errors: Record<string, string[]> = {};

        messages.forEach((msg) => {
            const field = this.extractFieldName(msg);

            if (!errors[field]) {
                errors[field] = [];
            }
            errors[field].push(this.translateMessage(msg, locale));
        });

        return errors;
    }

    private extractFieldName(message: string): string {
        if (!message) return 'general';

        if (message.includes('_')) {
            return message.split('_')[0] || 'general';
        }

        const match = message.match(/^([a-zA-Z]+)/);
        return match ? match[1] : 'general';
    }

    private translateMessage(message: string, locale: string): string {
        if (!message) return message;

        const translatedAuth = this.i18n.t(message, 'auth', locale);
        if (translatedAuth !== message) {
            return translatedAuth;
        }

        const translatedCommon = this.i18n.t(message, 'common', locale);
        if (translatedCommon !== message) {
            return translatedCommon;
        }

        return message;
    }
}
