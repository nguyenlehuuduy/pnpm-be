import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  // @ApiProperty({ default: [] })
  // @IsArray()
  // messages: JSON;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  aiGenerated: JSON;
}
