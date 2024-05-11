import { Module } from '@nestjs/common';
import { LLMsModule } from '../llms/llms.module';
import { UsersModule } from '../users/users.module';
import { ConversationsController } from './converastions.controller';
import { ConversationsService } from './conversations.service';
import { RelationalConversationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalConversationPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule, LLMsModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [infrastructurePersistenceModule],
})
export class ConversationsModule {}
