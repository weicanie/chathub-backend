import { Module } from '@nestjs/common';
import { AichatController } from './aichat.controller';
import { AichatService } from './aichat.service';

@Module({
	controllers: [AichatController],
	providers: [AichatService],
	exports: [AichatService]
})
export class AichatModule {}
