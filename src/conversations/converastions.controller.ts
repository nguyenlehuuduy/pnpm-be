import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { Conversation } from './domain/conversation';
import { CreateConversationDto } from './dto/create-conversation';
import { QueryConversationDto } from './dto/query-conversation.dto';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { MAX_LIMIT_PER_PAGE } from '../../test/utils/constants';
import { infinityPagination } from '../utils/infinity-pagination';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ChatConversationDto } from './dto/chat-conversation.dto';
import { ChatResponseDto } from 'src/llms/dto/chat-response.dto';

// @Roles(RoleEnum.user)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
@ApiTags('Conversations')
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryConversationDto,
  ): Promise<InfinityPaginationResultType<Conversation>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > MAX_LIMIT_PER_PAGE) {
      limit = MAX_LIMIT_PER_PAGE;
    }

    return infinityPagination(
      await this.conversationsService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: Conversation['id'],
  ): Promise<NullableType<Conversation>> {
    return this.conversationsService.findOne({
      id,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    body: CreateConversationDto,
  ): Promise<Conversation> {
    return this.conversationsService.create(body);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Conversation['id'],
    @Body() body: UpdateConversationDto,
  ): Promise<NullableType<Conversation>> {
    return this.conversationsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: Conversation['id']): Promise<void> {
    return this.conversationsService.softDelete(id);
  }

  @Post(':id/chat')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  chat(
    @Param('id') id: Conversation['id'],
    @Body() body: ChatConversationDto,
  ): Promise<NullableType<ChatResponseDto>> {
    return this.conversationsService.chat(id, body.userMessage);
  }

  @Post(':id/chat/follow-up')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  followUp(
    @Param('id') id: Conversation['id'],
  ): Promise<NullableType<ChatResponseDto>> {
    return this.conversationsService.followUp(id);
  }
}
