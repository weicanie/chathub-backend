import { Module } from '@nestjs/common';
import { ChatHistoryModule } from './chat_history/chat_history.module';
import { ModelService } from './model.service';

@Module({
	controllers: [],
	providers: [ModelService],
	exports: [ModelService],
	imports: [ChatHistoryModule]
})
export class ModelModule {}
