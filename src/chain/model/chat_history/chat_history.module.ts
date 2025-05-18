import { Module } from '@nestjs/common';
import { ChatHistoryService } from './chat_history.service';

@Module({
	controllers: [],
	providers: [ChatHistoryService],
	exports: [ChatHistoryService]
})
export class ChatHistoryModule {}
