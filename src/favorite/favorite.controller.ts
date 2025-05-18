import { Controller, Get, Query } from '@nestjs/common';
import { RequireLogin, UserInfo } from '../decorator';
import { FavoriteService } from './favorite.service';
@Controller('favorite')
@RequireLogin()
export class FavoriteController {
	constructor(private readonly favoriteService: FavoriteService) {}

	@Get('list')
	async list(@UserInfo('userId') userId: number) {
		return this.favoriteService.list(userId);
	}

	@Get('add')
	async add(@UserInfo('userId') userId: number, @Query('chatRecordId') chatRecordId: number) {
		return this.favoriteService.add(userId, chatRecordId);
	}

	@Get('del')
	async del(@Query('id') id: number) {
		return this.favoriteService.del(id);
	}
}
