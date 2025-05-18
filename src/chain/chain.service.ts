import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
import { Injectable } from '@nestjs/common';
import { ConversationSummaryMemory } from 'langchain/memory';
import { ModelService } from './model/model.service';
import { PromptService } from './prompt/prompt.service';
@Injectable()
export class ChainService {
	constructor(
		public modelService: ModelService,
		public promptService: PromptService
	) {}

	/**
	 * 用于一次性问答,不感知上下文
	 * @param prompt
	 * @returns
	 */
	async createAnswerChain(prompt: ChatPromptTemplate) {
		const llm = await this.modelService.getLLMDeepSeek();
		const outputParser = new StringOutputParser();
		const chain = RunnableSequence.from([prompt, llm, outputParser]);
		return chain;
	}

	chatPrompt = PromptTemplate.fromTemplate(`
		你是一个乐于助人的助手。尽你所能回答所有问题。
		{history}
		Human: {input}
		AI:
		`);

	//TODO chathistory 使用数据库存储, 1对多关系（使用redis缓存进行当前会话优化,提高应答速度）
	/**
	 * 用于感知上下文的聊天。默认使用 ConversationSummaryMemory
	 * @param prompt 传递给llm的prompt
	 * @param memoryType memory类型，默认 ConversationSummaryMemory
	 * @returns
	 */
	async createChatChain(prompt = this.chatPrompt) {
		const chatHistory = this.modelService.getChatHistory(); //使用自定义的chatHistory
		const memory = new ConversationSummaryMemory({
			chatHistory: chatHistory,
			memoryKey: 'history',
			llm: await this.modelService.getLLMOpenAI()
		});

		const llm = await this.modelService.getLLMOpenAI();
		const outputParser = new StringOutputParser();

		let lastInput = ''; //储存用户当前输入（以更新memory）
		const chain = RunnableSequence.from([
			{
				input: (input, options) => {
					lastInput = input;
					return input;
				},
				history: async (input: any, options: any) => {
					const vars = await memory.loadMemoryVariables({ input }); //EntityMemory需要传入input
					console.log('vars.entities', vars.entities);
					return vars.history || vars.summary || '';
				}
			},
			prompt,
			llm,
			outputParser,
			RunnableLambda.from(async input => {
				await memory.saveContext({ input: lastInput }, { output: input });
				return input;
			})
		]);
		return chain;
	}
}
