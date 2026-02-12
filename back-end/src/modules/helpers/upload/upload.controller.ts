import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

interface UploadedFilePayload {
    buffer: Buffer;
    originalname: string;
    size: number;
}

@Controller('helpers')
export class UploadController {
    private readonly logger = new Logger(UploadController.name);

    constructor(private readonly uploadService: UploadService) { }

    /**
     * POST /api/helpers/upload
     * Upload file with progress tracking
     */
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB max
            },
        }),
    )
    async upload(
        @UploadedFile() file: UploadedFilePayload,
        @Body('path') path: string = 'uploads',
        @Body('for') sizePreset: string = 'default',
    ) {
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded');
            }

            const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
            this.logger.log(`📤 Upload started - File: ${file.originalname} (${fileSizeMB} MB)`);

            const result = await this.uploadService.processAndUploadImage(
                file.buffer,
                file.originalname,
                path,
                sizePreset,
            );

            this.logger.log(`✅ Upload complete - ${Object.keys(result).length} versions generated`);

            return result;
        } catch (error) {
            this.logger.error('Upload error:', error.stack || error.message);
            throw error;
        }
    }
}
