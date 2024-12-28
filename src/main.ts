import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AppModule } from './app.module';
import { SentryFilter } from './common/filter/sentry.filter';

declare const module: any; // hot reload | webpack 설정

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // hot reload | webpack 설정
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // sentry 설정
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('Swagger API description page')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory); // localhost:3000/api

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
