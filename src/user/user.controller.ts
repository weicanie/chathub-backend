import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Query
} from '@nestjs/common';
import { RequireLogin, UserInfo } from '../decorator';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { UserInfoFromToken } from '../types';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
	@Inject(EmailService)
	private emailService: EmailService;

	@Inject(RedisService)
	private redisService: RedisService;

	constructor(private readonly userService: UserService) {}

	@Post('regist')
	async regist(@Body() registerUser: RegisterUserDto) {
		return await this.userService.regist(registerUser);
	}

	@Get('register-captcha')
	async captcha(@Query('address') address: string) {
		if (!address) {
			throw new BadRequestException('邮箱地址不能为空');
		}
		const code = Math.random().toString().slice(2, 8);
		await this.redisService.set(`captcha_${address}`, code, 5 * 60);
		await this.emailService.sendMail({
			to: address,
			subject: '注册验证码',
			html: `<p>你的注册验证码是 ${code}</p>`
		});
		return '发送成功';
	}

	@Get('search-user')
	async searchUser(@Query('name') name: string) {
		return await this.userService.searchUser(name);
	}

	@Post('login')
	async login(@Body() loginUser: LoginUserDto) {
		return await this.userService.login(loginUser);
	}

	@Post('logout')
	async logout(@Body('username') username: string) {
		return await this.userService.logout(username);
	}

	@Get(':id')
	async getInfoById(@Param('id') userId: number) {
		if (!userId) {
			throw new HttpException('请检查id', HttpStatus.BAD_REQUEST);
		}
		return this.userService.findUserDetailById(userId);
	}

	@Get()
	async getInfoByName(@Query('username') username: string) {
		return this.userService.findUserDetailByName(username);
	}

	@RequireLogin()
	@Patch('upload-avatar')
	async uploadAvatar(
		@UserInfo() userInfo: UserInfoFromToken,
		@Query('name') name: string,
		@Query('bucketName') bucketName = 'coderhow'
	) {
		return this.userService.uploadAvatar(userInfo, name, bucketName);
	}

	@Post('update_password')
	async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
		return this.userService.updatePassword(passwordDto);
	}

	@Get('update_password/captcha')
	@RequireLogin()
	async updatePasswordCaptcha(@Query('address') address: string) {
		if (!address) {
			throw new BadRequestException('邮箱地址不能为空');
		}
		const code = Math.random().toString().slice(2, 8);
		await this.redisService.set(`update_password_captcha_${address}`, code, 10 * 60);
		await this.emailService.sendMail({
			to: address,
			subject: '更改密码验证码',
			html: `<p>你的更改密码验证码是 ${code}</p>`
		});
		return '发送成功';
	}

	// TODO 测试更新邮箱接口
	@Post('update_email')
	@RequireLogin()
	async updateEmail(@Body() passwordDto: UpdateUserEmailDto, @UserInfo('userId') userId: number) {
		return this.userService.updateEmail(userId, passwordDto);
	}

	@Get('update_email/captcha')
	async updateEmailCaptcha(@Query('address') address: string) {
		if (!address) {
			throw new BadRequestException('邮箱地址不能为空');
		}
		const code = Math.random().toString().slice(2, 8);
		await this.redisService.set(`update_password_email_${address}`, code, 10 * 60);
		await this.emailService.sendMail({
			to: address,
			subject: '更改邮箱验证码',
			html: `<p>你的更改邮箱验证码是 ${code}</p>`
		});
		return '发送成功';
	}

	//更新密码和邮箱外的信息
	@Post('update')
	@RequireLogin()
	async updateInfo(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
		return await this.userService.updateInfo(userId, updateUserDto);
	}

	@Get('update/captcha')
	@RequireLogin()
	async updateInfoCaptcha(@UserInfo('userId') userId: number) {
		const { email: address } = await this.userService.findUserDetailById(userId);
		const code = Math.random().toString().slice(2, 8);
		await this.redisService.set(`update_user_captcha_${address}`, code, 10 * 60);
		await this.emailService.sendMail({
			to: address,
			subject: '更改用户信息验证码',
			html: `<p>你的验证码是 ${code}</p>`
		});
		return '发送成功';
	}
}
