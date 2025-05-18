import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './APP/app.module';
// 显式引用Node.js类型以解决process相关问题
/// <reference types="node" />
async function bootstrap() {
	dotenv.config();

	const app = await NestFactory.create(AppModule);
	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('guliguli 接口文档')
		.setDescription('guliguli 接口文档')
		.setVersion('1.0')
		.addBearerAuth({
			type: 'http',
			description: 'jwt token',
			name: 'bearer'
		})
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, document);

	await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
