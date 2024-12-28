import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validator 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에서 정의된 속성만 허용
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성은 거부
      transform: true, // 요청된 데이터를 DTO로 변환
      skipMissingProperties: false, // 필수 항목이 없으면 거부
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
