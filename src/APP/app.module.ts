import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from '../chat/chat.module';
import { ChatroomModule } from '../chatroom/chatroom.module';
import { DbModule } from '../DB/db.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IsLoginGuard } from './guard/is-login.guard';

@Module({
	imports: [
		DbModule,
		FriendshipModule,
		ChatroomModule,
		ChatModule,
		FavoriteModule,
		UserModule,
		JwtModule.registerAsync({
			global: true,
			useFactory() {
				return {
					signOptions: {}
				};
			}
		})
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: IsLoginGuard
		},
		// ValidationPipe默认不对参数进行自动类型转换, 手动设置{ transform: true }来开启（dto的属性也会转）
		{
			provide: APP_PIPE,
			useFactory() {
				return new ValidationPipe({ transform: true });
			}
		}
	]
})
export class AppModule {}
