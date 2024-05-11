import { ChatAnthropic } from '@langchain/anthropic';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { BaseMessagePromptTemplateLike } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from 'langchain/prompts';
import { MAX_TOKEN } from './config/constant';
import { followUpPrompt, systemPrompt } from './config/prompt';
import { ChatMessageDto, ChatMessageRole } from './dto/chat-message.dto';

@Injectable()
export class LLMsService {
  async chatOpenAI(messages: ChatMessageDto[]): Promise<ChatMessageDto> {
    const mappedMessages: BaseMessagePromptTemplateLike[] = messages.map(
      (m) => [m.role, m.content],
    );
    console.log(mappedMessages);
    const prompt = ChatPromptTemplate.fromMessages([
      systemPrompt,
      ...mappedMessages,
    ]);

    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
    });
    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const response = await chain.invoke({});

    return {
      role: ChatMessageRole.ASSISTANT,
      content: response,
    };
  }

  async chatAnthropic(messages: ChatMessageDto[]): Promise<ChatMessageDto> {
    const mappedMessages: BaseMessagePromptTemplateLike[] = messages.map(
      (m) => [m.role, m.content],
    );

    const prompt = ChatPromptTemplate.fromMessages([
      systemPrompt,
      ...mappedMessages,
    ]);

    const model = new ChatAnthropic({
      modelName: 'claude-3-haiku-20240307',
      temperature: 0.4,
      maxTokensToSample: MAX_TOKEN,
    });

    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const response = await chain.invoke({});

    return {
      role: ChatMessageRole.ASSISTANT,
      content: response.toString(),
    };
  }

  async followUpAnthropic(messages: ChatMessageDto[]): Promise<ChatMessageDto> {
    const mappedMessages: BaseMessagePromptTemplateLike[] = messages.map(
      (m) => [m.role, m.content],
    );

    const prompt = ChatPromptTemplate.fromMessages([
      systemPrompt,
      ...mappedMessages,
      followUpPrompt,
    ]);

    const model = new ChatAnthropic({
      modelName: 'claude-3-haiku-20240307',
      temperature: 0.4,
      maxTokensToSample: MAX_TOKEN,
    });

    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const response = await chain.invoke({});

    return {
      role: ChatMessageRole.ASSISTANT,
      content: response.toString(),
    };
  }
}
