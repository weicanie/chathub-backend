import { Controller, Get, Logger, Query } from '@nestjs/common';
import { RequireLogin } from '../decorator';
import { OssService } from './oss.service';
@Controller('oss')
export class OssController {
	private logger = new Logger();

	constructor(private ossService: OssService) {}

	@RequireLogin()
	@Get('presignedUrl')
	async presignedPutObject(
		@Query('name') name: string,
		@Query('bucketName') bucketName = 'coderhow'
	) {
		try {
			return await this.ossService.presignedPutObject(name, bucketName); // 桶名、对象名、预签名URL过期时间
		} catch (error) {
			this.logger.error(error, 'OssController ~ presignedPutObject');
		}
	}
}
