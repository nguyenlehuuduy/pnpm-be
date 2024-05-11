import { Transform } from 'class-transformer';
import { User } from '../../users/domain/user';
import {
  ChatMessageDto,
  ChatMessageRole,
} from '../../llms/dto/chat-message.dto';

export type ConversationMessage =
  | ChatMessageDto
  | {
      role: ChatMessageRole;
      content: string;
    };

export class Conversation {
  id?: number | string;

  // @Expose({ groups: ['me', 'admin'] })
  @Transform(
    ({ value }) => ({
      id: value.id,
    }),
    { toPlainOnly: true },
  )
  user: User;

  // @Expose({ groups: ['me', 'admin'] })
  messages: Array<ConversationMessage>;

  // @Expose({ groups: ['me', 'admin'] })
  aiGenerated: object;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
