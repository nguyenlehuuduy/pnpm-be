/*
ChatMessageDto {
    role: string;
    message: string;
    timestamp: Date;
}

ListChatMessagesDto {
    messages: ChatMessageDto[];
}
*/

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum ChatMessageRole {
  HUMAN = 'human',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class ChatMessageDto {
  @ApiProperty()
  @IsEnum(ChatMessageRole)
  @IsNotEmpty()
  role: string;

  @ApiProperty({ default: 'Hi Thoai' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ListChatMessagesDto {
  @ApiProperty({ type: [ChatMessageDto] })
  @Type(() => ChatMessageDto)
  @ValidateNested({ each: true })
  @MinLength(1)
  messages: ChatMessageDto[];
}
