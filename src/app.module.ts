import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import * as process from 'node:process';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TestModule } from './test/test.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000).required(),
        DATABASE_URL: Joi.string().required(),
        DATABASE_TYPE: Joi.string().valid('postgresql', 'mongodb').required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_DATABASE_NAME: Joi.string().required(),
        SENTRY_DSN: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    SentryModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          // console 출력설정
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              const stringContext = context ? `[${String(context)}]` : '';
              return `[${String(timestamp)}] ${String(level)}: ${String(message)} ${stringContext}`;
            }),
          ),
        }),
        new winston.transports.File({
          // file export 설정
          filename: 'application.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(), // json 형식
          ),
        }),
      ],
    }),
    TestModule,
    CommonModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // sentry 설정
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
