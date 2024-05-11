import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Conversation } from '../../../../domain/conversation';
import { SortConversationDto } from '../../../../dto/query-conversation.dto';
import { UpdateConversationDto } from '../../../../dto/update-conversation.dto';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationMapper } from '../mappers/conversations.mapper';

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationsRepository: Repository<ConversationEntity>,
  ) {}

  async create(data: Conversation): Promise<Conversation> {
    const persistenceModel = ConversationMapper.toPersistence(data);
    const newConversation = await this.conversationsRepository.save(
      this.conversationsRepository.create(persistenceModel),
    );

    return ConversationMapper.toDomain(newConversation);
  }

  async findMany(): Promise<Conversation[]> {
    const conversations = await this.conversationsRepository.find();
    return conversations.map((conversation) =>
      ConversationMapper.toDomain(conversation),
    );
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortConversationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Conversation[]> {
    const where: FindOptionsWhere<ConversationEntity> = {
      // TODO
      user: {
        id: 1,
      },
    };
    const entities = await this.conversationsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => ConversationMapper.toDomain(user));
  }

  async findOne(
    fields: EntityCondition<Conversation>,
  ): Promise<NullableType<Conversation>> {
    const conversation = await this.conversationsRepository.findOne({
      where: fields as FindOptionsWhere<ConversationEntity>,
    });

    return conversation ? ConversationMapper.toDomain(conversation) : null;
  }

  async update(id: Conversation['id'], payload: UpdateConversationDto) {
    const entity = await this.conversationsRepository.findOne({
      where: {
        id: String(id),
      },
    });

    if (!entity) {
      throw new Error('Conversation not found');
    }

    const updatedConversation = await this.conversationsRepository.save(
      this.conversationsRepository.create(
        ConversationMapper.toPersistence({
          ...ConversationMapper.toDomain(entity),
          ...instanceToPlain(payload),
        }),
      ),
    );
    return ConversationMapper.toDomain(updatedConversation);
  }

  async softDelete(id: Conversation['id']): Promise<void> {
    if (!id) throw new Error('Id is required');
    await this.conversationsRepository.softDelete(id);
  }
}
