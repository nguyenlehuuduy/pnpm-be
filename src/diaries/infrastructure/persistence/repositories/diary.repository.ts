import { BadRequestException, Injectable } from '@nestjs/common';
import { Diary } from 'src/diaries/domain/diary';
import { SortDiaryDto } from 'src/diaries/dto/query-diary.dto';
import { UpdateDiaryDto } from 'src/diaries/dto/update-diary.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DiaryEntity } from '../entities/diary.entity';
import { DiaryMapper } from '../mappers/diary.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiariesRepository {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diariesRepository: Repository<DiaryEntity>,
  ) {}

  async create(data: Diary): Promise<Diary> {
    const persistenceModel = DiaryMapper.toPersistence(data);
    const newDiary = await this.diariesRepository.save(
      this.diariesRepository.create(persistenceModel),
    );

    return DiaryMapper.toDomain(newDiary);
  }

  async findMany(): Promise<Diary[]> {
    const diaries = await this.diariesRepository.find();

    return diaries.map((diary) => DiaryMapper.toDomain(diary));
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortDiaryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Diary[]> {
    const where: FindOptionsWhere<DiaryEntity> = {};
    const entities = await this.diariesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => DiaryMapper.toDomain(user));
  }

  async findOne(fields: EntityCondition<Diary>): Promise<NullableType<Diary>> {
    const diary = await this.diariesRepository.findOne({
      where: fields as FindOptionsWhere<DiaryEntity>,
    });

    return diary ? DiaryMapper.toDomain(diary) : null;
  }

  async update(id: Diary['id'], payload: UpdateDiaryDto): Promise<Diary> {
    const diary = await this.findOne({ id });
    if (!diary) {
      throw new BadRequestException('Diary not found');
    }

    const updatedDiary = await this.diariesRepository.save({
      ...diary,
      ...payload,
    });

    return DiaryMapper.toDomain(updatedDiary);
  }

  async softDelete(id: Diary['id']): Promise<void> {
    if (!id) {
      throw new BadRequestException('Diary id is required');
    }

    if (!(await this.findOne({ id }))) {
      throw new BadRequestException('Diary not found');
    }
    await this.diariesRepository.softDelete(id);
  }
}
