import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Conversation } from '../domain/conversation';

export class SortConversationDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Conversation;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryConversationDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  //   @ApiPropertyOptional({ type: String })
  //   @IsOptional()
  //   @Transform(({ value }) =>
  //     value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  //   )
  //   @ValidateNested()
  //   @Type(() => FilterUserDto)
  //   filters?: FilterUserDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortConversationDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortConversationDto)
  sort?: SortConversationDto[] | null;
}
