import { Injectable } from '@nestjs/common';
import { Diary } from './domain/diary';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { DiariesRepository } from './infrastructure/persistence/repositories/diary.repository';
import { FileType } from 'src/files/domain/file';
import { SortDiaryDto } from './dto/query-diary.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiariesService {
  constructor(private readonly diariesRepository: DiariesRepository) {}

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortDiaryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Diary[]> {
    return this.diariesRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
    });
  }

  findOne(fields: EntityCondition<Diary>): Promise<NullableType<Diary>> {
    return this.diariesRepository.findOne(fields);
  }

  async create(data: CreateDiaryDto, imageFiles: FileType[]): Promise<Diary> {
    const clonedPayload = {
      ...data,
      user: {
        id: data.userId,
      },
      imageLinks: imageFiles.map((x) => x.path),
    } as unknown as Diary;

    return this.diariesRepository.create(clonedPayload);
  }

  async update(
    id: Diary['id'],
    data: UpdateDiaryDto,
    imageFiles: FileType[],
  ): Promise<NullableType<Diary>> {
    if (data?.content === '') data.content = undefined;

    const clonedPayload = {
      ...data,
      user: {
        id: data.userId,
      },
      imageLinks:
        imageFiles.length === 0 ? undefined : imageFiles.map((x) => x.path),
    } as unknown as UpdateDiaryDto;

    return this.diariesRepository.update(id, clonedPayload);
  }

  async softDelete(id: Diary['id']): Promise<void> {
    return this.diariesRepository.softDelete(id);
  }
}
