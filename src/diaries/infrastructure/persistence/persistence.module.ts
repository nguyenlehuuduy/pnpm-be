import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { DiariesRepository } from './repositories/diary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  providers: [DiariesRepository],
  exports: [DiariesRepository],
})
export class DiaryPersistenceModule {}
