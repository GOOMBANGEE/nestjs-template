import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalGuard } from 'src/auth/guard/local.guard';
import { Logger } from 'winston';
import { CreateTestDto } from './dto/create-test.dto';
import { TestService } from './test.service';
import { RefreshGuard } from '../auth/guard/refresh.guard';
import { envKey } from '../common/const/env.const';

@Controller('test')
export class TestController {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly testService: TestService,
    private readonly configService: ConfigService,
  ) {}

  @Get('error')
  throwError() {
    throw new HttpException('custom error message', HttpStatus.BAD_REQUEST);
  }

  @Get('unexpected-error')
  throwUnexpectedError() {
    throw new Error('unexpected error occurred');
  }

  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    this.logger.info('method called', { context: 'TestController' });
    this.logger.debug('debug log');
    //
    // env config test
    this.logger.debug(`test: ${this.configService.get(envKey.saltOrRounds)}`);
    return this.testService.create(createTestDto);
  }

  @Post('local')
  @UseGuards(LocalGuard)
  local() {
    this.logger.debug('activate local strategy');
  }

  // @UseGuards(RefreshGuard) // auth/strategy/refresh.strategy.ts return payload: {username:string}
  @Get('jwt')
  @UseGuards(RefreshGuard)
  jwt(@Request() req) {
    this.logger.debug(req.user.email);
    this.logger.debug('activate jwt strategy');
  }
}
