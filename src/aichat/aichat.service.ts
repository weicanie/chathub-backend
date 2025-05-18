import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Injectable, Logger } from '@nestjs/common';
import { ChainService } from '../chain/chain.service';
import { DbService } from '../DB/db.service';
import { UserInfoFromToken } from '../types';
import { ConversationDto } from './dto/conversation.dto';
@Injectable()
export class AichatService {
	constructor(
		public dbService: DbService,
		public chainService: ChainService
	) {}

	private logger = new Logger();

	async getSummaryFromAI(title: string, content: string) {
		try {
			const prompt = ChatPromptTemplate.fromTemplate(`
		给这篇文章写一下总结,要求分点、简明扼要。
		标题：{title}
		内容：{content}
		`);
			const chain = await this.chainService.createAnswerChain(prompt);
			const response = await chain.invoke({ title, content });
			return response;
		} catch (error) {
			this.logger.error(error, 'AichatService', 'getSummaryFromAI');
		}
	}
	//TODO 前端不用再发送messages
	async getAnswerFromAI(question: string, messages: string[]) {
		try {
			const chain = await this.chainService.createChatChain();
			const answer = await chain.invoke({ input: question });
			return answer;
		} catch (error) {
			this.logger.error(error, 'AichatService', 'getAnswerFromAI');
		}
	}

	async storeConversation(userInfo: UserInfoFromToken, conversationDto: ConversationDto) {
		const { userId } = userInfo;
		const { key, label } = conversationDto;
		let content = conversationDto.content;
		const values = await this.dbService.ai_conversation.findMany({
			where: {
				keyname: String(key),
				user_id: +userId
			}
		});

		// 初始化空会话
		if (!values[0]?.content && content.length === 0) {
			const res = await this.dbService.ai_conversation.create({
				data: {
					keyname: String(key),
					label,
					content,
					user_id: +userId
				}
			});
			return res;
		}
		// 非初始化空对话
		if (content.length === 0) {
			return '空对话,已忽略';
		}
		//判断会话数据是否已存在
		if (values[0]?.content) {
			//更新
			const res2 = await this.dbService.ai_conversation.updateMany({
				where: {
					keyname: String(key),
					user_id: +userId
				},
				data: {
					content
				}
			});
			return res2;
		} else {
			//新增
			const res3 = await this.dbService.ai_conversation.create({
				data: {
					keyname: String(key),
					label,
					content,
					user_id: +userId
				}
			});
			return res3;
		}
	}

	async getConversationList(userInfo: UserInfoFromToken) {
		const { userId } = userInfo;
		const values = await this.dbService.ai_conversation.findMany({
			where: {
				user_id: +userId
			}
		});
		return values;
	}
}
