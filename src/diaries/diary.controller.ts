import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileType } from 'src/files/domain/file';
import { FilesLocalService } from 'src/files/infrastructure/uploader/local/files.service';
import { DiariesService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { Diary } from './domain/diary';
import { QueryDiaryDto } from './dto/query-diary.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { MAX_LIMIT_PER_PAGE } from 'test/utils/constants';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { NullableType } from 'src/utils/types/nullable.type';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@ApiTags('Diaries')
@Controller({
  path: 'diaries',
  version: '1',
})
export class DiariesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly filesService: FilesLocalService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryDiaryDto,
  ): Promise<InfinityPaginationResultType<Diary>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > MAX_LIMIT_PER_PAGE) {
      limit = MAX_LIMIT_PER_PAGE;
    }

    return infinityPagination(
      await this.diariesService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Diary['id']): Promise<NullableType<Diary>> {
    return this.diariesService.findOne({
      id,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'integer',
        },
        content: {
          type: 'string',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['userId', 'content'],
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() body: CreateDiaryDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Diary> {
    const imageFiles: FileType[] = (
      await Promise.all(images.map((image) => this.filesService.create(image)))
    ).map((item) => item.file);

    return this.diariesService.create(body, imageFiles);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'integer',
        },
        content: {
          type: 'string',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: Diary['id'],
    @Body() body: UpdateDiaryDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<NullableType<Diary>> {
    const imageFiles: FileType[] = (
      await Promise.all(images.map((image) => this.filesService.create(image)))
    ).map((item) => item.file);

    return this.diariesService.update(id, body, imageFiles);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: Diary['id']): Promise<void> {
    return this.diariesService.softDelete(id);
  }
}
