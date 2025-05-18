import {
	ChatOpenAI,
	ChatOpenAIFields,
	ClientOptions,
	OpenAIEmbeddings,
	OpenAIEmbeddingsParams
} from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ChatHistoryService } from './chat_history/chat_history.service';

type EmbedOpenAIFields = Partial<OpenAIEmbeddingsParams> & {
	verbose?: boolean;
	openAIApiKey?: string;
	apiKey?: string;
	configuration?: ClientOptions;
};

@Injectable()
export class ModelService {
	public LLM_openai: ChatOpenAI;
	public LLM_deepseek: ChatOpenAI;
	public embedModel_openai: OpenAIEmbeddings;

	constructor(public chatHistoryService: ChatHistoryService) {
		const LLM_openai_config: ChatOpenAIFields = {
			model: 'gpt-4o-mini',
			configuration: {
				apiKey: process.env.OPENAI_API_KEY,
				timeout: 6000,
				baseURL: process.env.OPENAI_API_BASE_URL,
				maxRetries: 3
			}
		};
		const LLM_deepseek_config: ChatOpenAIFields = {
			model: 'deepseek-chat',
			configuration: {
				apiKey: process.env.API_KEY_DEEPSEEK,
				timeout: 6000,
				baseURL: process.env.BASE_URL_DEEPSEEK,
				maxRetries: 3
			}
		};
		const embedModel_openai_config: EmbedOpenAIFields = {
			model: 'text-embedding-3-small',
			configuration: {
				apiKey: process.env.OPENAI_API_KEY,
				timeout: 6000,
				baseURL: process.env.OPENAI_API_BASE_URL,
				maxRetries: 1
			}
		};

		this.LLM_openai = new ChatOpenAI(LLM_openai_config);
		this.LLM_deepseek = new ChatOpenAI(LLM_deepseek_config);
		this.embedModel_openai = new OpenAIEmbeddings(embedModel_openai_config);
	}

	async getLLMOpenAI() {
		return this.LLM_openai;
	}

	async getLLMDeepSeek() {
		return this.LLM_deepseek;
	}

	async getEmbedModelOpenAI() {
		return this.embedModel_openai;
	}

	getChatHistory(
		sessionId = 'json_chat_history',
		dir = path.join(process.cwd(), '/chat_history_data')
	) {
		return this.chatHistoryService.getChatHistory(sessionId, dir);
	}
}
