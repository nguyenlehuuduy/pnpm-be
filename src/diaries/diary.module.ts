import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileConfig, FileDriver } from 'src/files/config/file-config.type';
import fileConfig from 'src/files/config/file.config';
import { FilesLocalModule } from 'src/files/infrastructure/uploader/local/files.module';
import { FilesS3PresignedModule } from 'src/files/infrastructure/uploader/s3-presigned/files.module';
import { FilesS3Module } from 'src/files/infrastructure/uploader/s3/files.module';
import { DiariesController } from './diary.controller';
import { DiariesService } from './diary.service';
import { DiaryPersistenceModule } from './infrastructure/persistence/persistence.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AllConfigType } from 'src/config/config.type';

const infrastructurePersistenceModule = DiaryPersistenceModule;

const infrastructureUploaderModule =
  (fileConfig() as FileConfig).driver === FileDriver.LOCAL
    ? FilesLocalModule
    : (fileConfig() as FileConfig).driver === FileDriver.S3
      ? FilesS3Module
      : FilesS3PresignedModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    infrastructureUploaderModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new UnprocessableEntityException({
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                    file: `cantUploadFileType`,
                  },
                }),
                false,
              );
            }

            callback(null, true);
          },
          storage: diskStorage({
            destination: './files',
            filename: (request, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [DiariesController],
  providers: [DiariesService],
  exports: [DiariesService, infrastructurePersistenceModule],
})
export class DiariesModule {}
