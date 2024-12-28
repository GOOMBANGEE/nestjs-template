import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [TestModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
