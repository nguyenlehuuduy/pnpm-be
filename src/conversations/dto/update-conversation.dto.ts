import { PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation';

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
