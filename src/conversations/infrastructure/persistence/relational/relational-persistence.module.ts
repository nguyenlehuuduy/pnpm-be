import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationsRepository } from './repositories/conversations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
  providers: [ConversationsRepository],
  exports: [ConversationsRepository],
})
export class RelationalConversationPersistenceModule {}
