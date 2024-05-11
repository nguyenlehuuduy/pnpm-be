import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatResponseDto {
  @ApiProperty()
  @IsString()
  content: string;
}
