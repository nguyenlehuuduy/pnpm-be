import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import {
  Conversation,
  ConversationMessage,
} from '../../../../domain/conversation';
import { ConversationEntity } from '../entities/conversation.entity';

export class ConversationMapper {
  static toDomain(raw: ConversationEntity): Conversation {
    const conversation = new Conversation();
    conversation.id = raw.id;
    conversation.user = raw.user;
    try {
      conversation.messages = raw.messages as ConversationMessage[];
    } catch (e) {
      throw new Error('Mapping error');
    }
    conversation.aiGenerated = raw.aiGenerated;
    conversation.createdAt = raw.createdAt;
    conversation.updatedAt = raw.updatedAt;
    conversation.deletedAt = raw.deletedAt;

    return conversation;
  }

  static toPersistence(conversation: Conversation): ConversationEntity {
    const conversationEntity = new ConversationEntity();

    if (conversation?.id) {
      conversationEntity.id = String(conversation.id);
    }

    const userEntity = new UserEntity();
    userEntity.id = Number(conversation.user.id);
    conversationEntity.user = userEntity;

    conversationEntity.messages = conversation.messages;
    conversationEntity.aiGenerated = conversation.aiGenerated;
    conversationEntity.createdAt = conversation.createdAt;
    conversationEntity.updatedAt = conversation.updatedAt;
    conversationEntity.deletedAt = conversation.deletedAt;

    return conversationEntity;
  }
}
