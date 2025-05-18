import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { OssModule } from '../oss/oss.module';
import { RedisModule } from '../redis/redis.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
	imports: [OssModule, RedisModule, EmailModule]
})
export class UserModule {}
