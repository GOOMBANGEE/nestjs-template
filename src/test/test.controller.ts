import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { envVariableKeys } from '../common/const/env.const';

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

    // env config test
    this.logger.debug(
      `test: ${this.configService.get(envVariableKeys.databasePort)}`,
    );
    return this.testService.create(createTestDto);
  }

  @Get()
  findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
