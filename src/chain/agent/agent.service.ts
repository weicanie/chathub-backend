import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { Injectable } from '@nestjs/common';
import { AgentExecutor, createOpenAIToolsAgent, createReactAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';
import { ModelService } from '../model/model.service';
@Injectable()
export class AgentService {
	constructor(private modelService: ModelService) {}
	async createAgentWithTools(tools: any[]) {
		const prompt = await pull<ChatPromptTemplate>('hwchase17/openai-tools-agent');
		const agent = await createOpenAIToolsAgent({
			llm: await this.modelService.getLLMOpenAI(),
			prompt,
			tools
		});
		const agentExecutor = new AgentExecutor({
			agent,
			tools
		});
		return agentExecutor;
	}

	async createReActAgent(tools: any[]) {
		const llm = await this.modelService.getLLMDeepSeek();
		const prompt = await pull<PromptTemplate>('hwchase17/react');

		const agent = await createReactAgent({ tools, llm, prompt });
		const agentExecutor = new AgentExecutor({
			agent,
			tools
		});
		return agentExecutor;
	}
}
