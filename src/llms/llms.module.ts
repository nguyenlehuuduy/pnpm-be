import { Module } from '@nestjs/common';
import { LLMsService } from './llms.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LLMsService],
  exports: [LLMsService],
})
export class LLMsModule {}
