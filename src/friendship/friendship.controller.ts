import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RequireLogin, UserInfo } from '../decorator';
import { resBundle } from '../utils';
import { FriendAddDto } from './dto/friend-add.dto';
import { FriendshipService } from './friendship.service';
@Controller('friendship')
@RequireLogin()
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Post('add')
	async add(@Body() friendAddDto: FriendAddDto, @UserInfo('userId') userId: number) {
		return this.friendshipService.add(friendAddDto, userId);
	}

	@Get('request_list')
	async list(@UserInfo('userId') userId: number) {
		return this.friendshipService.list(userId);
	}

	@Get('agree/:id')
	async agree(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
		if (!friendId) {
			throw new BadRequestException('添加的好友 id 不能为空');
		}
		return this.friendshipService.agree(friendId, userId);
	}

	@Get('reject/:id')
	async reject(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
		if (!friendId) {
			throw new BadRequestException('添加的好友 id 不能为空');
		}
		return this.friendshipService.reject(friendId, userId);
	}

	@Get('list')
	async getfriendlist(@UserInfo('userId') userId: number) {
		const res = await this.friendshipService.getFriendlist(userId);
		return resBundle<typeof res>(res);
	}

	@Get('one')
	async getfriend(@UserInfo('userId') userId: number, @Query('name') name: string) {
		const res = await this.friendshipService.getFriend(userId, name);
		return resBundle<typeof res>(res);
	}

	@Post('remove/:id')
	async remove(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
		return this.friendshipService.remove(friendId, userId);
	}
}
