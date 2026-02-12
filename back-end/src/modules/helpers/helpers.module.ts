import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload/upload.controller';
import { CountriesController } from './countries/countries.controller';
import { UploadService } from './upload/upload.service';
import { CountriesService } from './countries/countries.service';
import { Country } from './countries/country.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Country]),
        MulterModule.register({
            storage: {
                _handleFile: (req, file, cb) => {
                    const chunks: Buffer[] = [];
                    file.stream.on('data', (chunk) => chunks.push(chunk));
                    file.stream.on('end', () => {
                        cb(null, {
                            buffer: Buffer.concat(chunks),
                            size: Buffer.concat(chunks).length,
                        } as any);
                    });
                    file.stream.on('error', cb);
                },
                _removeFile: (req, file, cb) => cb(null),
            },
        }),
    ],
    controllers: [UploadController, CountriesController],
    providers: [UploadService, CountriesService],
    exports: [UploadService, CountriesService],
})
export class HelpersModule { }
