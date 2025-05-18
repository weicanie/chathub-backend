import { Controller, Get, Query } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
@Controller('chat-history')
export class ChatHistoryController {
	constructor(private readonly chatRecordService: ChatHistoryService) {}

	@Get('list')
	async list(@Query('chatroomId') chatroomId: string) {
		return this.chatRecordService.list(+chatroomId);
	}
}
