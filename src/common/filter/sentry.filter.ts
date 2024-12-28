import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: HttpException, host: ArgumentsHost) {
    Sentry.captureException(exception);
    super.catch(exception, host);
  }
}
