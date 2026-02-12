import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly publicUrl: string;

    constructor(private configService: ConfigService) {
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');
        const endpoint = this.configService.get<string>('R2_ENDPOINT');
        this.bucketName = this.configService.get<string>('R2_BUCKET_NAME');
        this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL');

        // Log configuration status (without sensitive data)
        this.logger.log('R2 Configuration Status:');
        this.logger.log(`- Access Key ID: ${accessKeyId ? '✅ Set' : '❌ Missing'}`);
        this.logger.log(`- Secret Access Key: ${secretAccessKey ? '✅ Set' : '❌ Missing'}`);
        this.logger.log(`- Endpoint: ${endpoint || '❌ Missing'}`);
        this.logger.log(`- Bucket Name: ${this.bucketName || '❌ Missing'}`);
        this.logger.log(`- Public URL: ${this.publicUrl || '❌ Missing'}`);

        if (!accessKeyId || !secretAccessKey || !endpoint || !this.bucketName || !this.publicUrl) {
            this.logger.warn('⚠️ R2 configuration incomplete. Upload functionality may not work properly.');
            this.logger.warn('Please set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME, and R2_PUBLIC_URL in .env file');
        }

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    /**
     * Process and upload image with multiple size versions
     * Progress is tracked via HTTP upload progress on the client side
     * All versions are uploaded in parallel for maximum speed
     */
    async processAndUploadImage(
        buffer: Buffer,
        fileName: string,
        path: string,
        sizePreset: string,
    ) {
        const startTime = Date.now();
        const baseName = crypto.randomUUID();

        this.logger.log(`🖼️  Processing image with preset: ${sizePreset}`);

        // Optimize the original image before uploading
        let optimizedBuffer = buffer;
        try {
            const image = sharp(buffer);
            const metadata = await image.metadata();

            // Only optimize if it's a large image
            if (metadata.width && metadata.width > 1920) {
                optimizedBuffer = await image
                    .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 85, mozjpeg: true })
                    .toBuffer();
                this.logger.debug(`📉 Compressed original: ${(buffer.length / 1024).toFixed(0)}KB → ${(optimizedBuffer.length / 1024).toFixed(0)}KB`);
            } else {
                // Just optimize without resizing
                optimizedBuffer = await image
                    .jpeg({ quality: 85, mozjpeg: true })
                    .toBuffer();
            }
        } catch (error) {
            this.logger.warn(`⚠️ Could not optimize original, uploading as-is: ${error.message}`);
            optimizedBuffer = buffer;
        }

        // Size configurations based on preset
        const sizeConfigs = this.getSizeConfigs(sizePreset);

        // Prepare all upload tasks to run in parallel
        const uploadTasks: Promise<{ key: string; url: string }>[] = [];

        // Original upload task
        const originalKey = `${path}/${baseName}.jpg`; // Always save as JPEG for smaller size
        uploadTasks.push(
            this.uploadToR2(originalKey, optimizedBuffer, 'image/jpeg').then(() => ({
                key: 'original',
                url: `${this.publicUrl}/${originalKey}`,
            }))
        );

        // Resized versions upload tasks
        for (const [sizeName, dimensions] of Object.entries(sizeConfigs)) {
            const task = (async () => {
                try {
                    const resizedBuffer = await sharp(buffer)
                        .resize(dimensions.width, dimensions.height, {
                            fit: dimensions.fit || 'cover',
                            position: 'center',
                        })
                        .jpeg({ quality: 80, mozjpeg: true }) // Use JPEG instead of PNG for smaller size
                        .toBuffer();

                    const resizedKey = `${path}/${baseName}-${sizeName}.jpg`;
                    await this.uploadToR2(resizedKey, resizedBuffer, 'image/jpeg');
                    return {
                        key: sizeName,
                        url: `${this.publicUrl}/${resizedKey}`,
                    };
                } catch (error) {
                    this.logger.error(`❌ Failed to process ${sizeName}:`, error.message);
                    return null;
                }
            })();
            uploadTasks.push(task);
        }

        // Execute all uploads in parallel
        const results = await Promise.all(uploadTasks);

        // Build URLs object from results
        const urls: Record<string, string> = {};
        for (const result of results) {
            if (result) {
                urls[result.key] = result.url;
                this.logger.debug(`✓ ${result.key} uploaded: ${result.url}`);
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        this.logger.log(`✅ Image processing complete in ${duration}s. Generated ${Object.keys(urls).length} versions`);
        return urls;
    }

    private getSizeConfigs(preset: string) {
        const configs: Record<string, Record<string, { width: number; height: number; fit?: 'cover' | 'inside' | 'contain' | 'fill' | 'outside' }>> = {
            profile: {
                '250x250': { width: 250, height: 250 },
            },
            cover: {
                '1200x600': { width: 1200, height: 600 },
            },
            logo: {
                '200x200': { width: 200, height: 200, fit: 'inside' as const },
            },
            default: {
                '250x250': { width: 250, height: 250 },
            },
        };

        return configs[preset] || configs.default;
    }

    private async uploadToR2(key: string, buffer: Buffer, contentType: string) {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            });

            await this.s3Client.send(command);
        } catch (error) {
            this.logger.error(`Failed to upload to R2: ${error.message}`);
            if (error.name === 'NoSuchBucket') {
                throw new Error(`R2 Bucket '${this.bucketName}' does not exist. Please create it in your Cloudflare R2 dashboard.`);
            }
            throw error;
        }
    }
}
