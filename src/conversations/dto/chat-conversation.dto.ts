import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatConversationDto {
  @ApiProperty({ type: 'string', description: 'User message to chat with AI.' })
  @IsString()
  @IsNotEmpty()
  userMessage: string;
}
