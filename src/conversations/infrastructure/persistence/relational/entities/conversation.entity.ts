import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  Conversation,
  ConversationMessage,
} from '../../../../domain/conversation';

@Entity({
  name: 'conversation',
})
export class ConversationEntity
  extends EntityRelationalHelper
  implements Conversation
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @Column({ type: 'jsonb', default: '[]' })
  messages: Array<ConversationMessage>;

  @Column({ type: 'jsonb', default: '{}' })
  aiGenerated: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
