import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { ChainService } from './chain.service';
import { ModelModule } from './model/model.module';
import { PromptModule } from './prompt/prompt.module';

@Module({
	controllers: [],
	providers: [ChainService],
	imports: [AgentModule, ModelModule, PromptModule],
	exports: [ChainService, AgentModule, ModelModule, PromptModule]
})
export class ChainModule {}
