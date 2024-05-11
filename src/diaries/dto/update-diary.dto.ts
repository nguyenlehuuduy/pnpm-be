import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateDiaryDto } from './create-diary.dto';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;
}
