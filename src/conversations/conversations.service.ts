import { BadRequestException, Injectable } from '@nestjs/common';
import { ConversationsRepository } from './infrastructure/persistence/relational/repositories/conversations.repository';
import { CreateConversationDto } from './dto/create-conversation';
import { SortConversationDto } from './dto/query-conversation.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { LLMsService } from '../llms/llms.service';
import { ChatMessageDto, ChatMessageRole } from '../llms/dto/chat-message.dto';
import { Conversation } from './domain/conversation';
import { ChatResponseDto } from '../llms/dto/chat-response.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly llmsService: LLMsService,
  ) {}

  async findMany(): Promise<Conversation[]> {
    return this.conversationsRepository.findMany();
  }

  findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortConversationDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Conversation[]> {
    return this.conversationsRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
    });
  }

  findOne(
    fields: EntityCondition<Conversation>,
  ): Promise<NullableType<Conversation>> {
    return this.conversationsRepository.findOne(fields);
  }

  async create(data: CreateConversationDto): Promise<Conversation> {
    const clonedPayload = {
      ...data,
      user: {
        id: data.userId,
      },
      messages: [
        {
          role: ChatMessageRole.ASSISTANT,
          content:
            '<greeting>Xin chào bạn, nếu bạn đang có những vấn đề khó nói, tâm tư bất ổn, xin hãy nói với Thoại, Thoại sẽ luôn đồng hành cùng bạn trong những câu chuyện này.</greeting>',
        },
      ],
    } as unknown as Conversation;

    return this.conversationsRepository.create(clonedPayload);
  }

  async update(
    id: Conversation['id'],
    data: UpdateConversationDto,
  ): Promise<NullableType<Conversation>> {
    // TODO: implement exceptions

    return this.conversationsRepository.update(id, data);
  }

  async softDelete(id: Conversation['id']): Promise<void> {
    await this.conversationsRepository.softDelete(id);
  }

  async chat(
    id: Conversation['id'],
    userMessage: string,
  ): Promise<ChatResponseDto> {
    // 1. get conversation
    // 2. get past messages
    // 3. query new message from llms service

    // TODO: check if conversation is of user

    const conversation = await this.findOne({ id });
    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const messages = conversation.messages;
    messages.push({
      role: ChatMessageRole.HUMAN,
      content: userMessage,
    });

    // OPENAI
    // const newMessage: ChatMessageDto =
    //   await this.llmsService.chatOpenAI(messages);

    // CLAUDE
    const newMessage: ChatMessageDto =
      await this.llmsService.chatAnthropic(messages);

    // 4. save new message
    messages.push(newMessage);
    await this.update(id, { messages } as unknown as UpdateConversationDto);

    const response = new ChatResponseDto();
    response.content = newMessage.content;

    return response;
  }

  async followUp(id: Conversation['id']): Promise<ChatResponseDto> {
    // 1. get conversation
    // 2. get pass message
    // 3. query LLM service to get follow up question
    // TODO: check if conversation is of user

    const conversation = await this.findOne({ id });
    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const messages = conversation.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== ChatMessageRole.ASSISTANT) {
      throw new BadRequestException('Last message should be from assistant');
    }

    const followUpMessage = await this.llmsService.followUpAnthropic(messages);

    // add follow up message to last message
    lastMessage.content += followUpMessage.content;

    // 4. save new message
    await this.update(id, { messages } as unknown as UpdateConversationDto);

    const response = new ChatResponseDto();
    response.content = followUpMessage.content;

    return response;
  }
}
