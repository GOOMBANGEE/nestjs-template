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
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { LocalGuard } from 'src/auth/guard/local.guard';
import { Logger } from 'winston';
import { envKey } from '../common/const/env.const';
import { CreateTestDto } from './dto/create-test.dto';
import { TestService } from './test.service';

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
    this.logger.debug(`test: ${this.configService.get(envKey.databasePort)}`);
    return this.testService.create(createTestDto);
  }

  @Post('local')
  @UseGuards(LocalGuard)
  local() {
    this.logger.debug('activate local strategy');
  }

  // @UseGuards(JwtGuard) // auth/strategy/jwt.strategy.ts return payload: {email:string}
  @Get('jwt')
  @UseGuards(JwtGuard)
  jwt(@Request() req) {
    this.logger.debug(req.user.email);
    this.logger.debug('activate jwt strategy');
  }
}
