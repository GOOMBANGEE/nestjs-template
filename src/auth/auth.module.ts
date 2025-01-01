import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [CommonModule, PassportModule, JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtService, JwtStrategy],
  exports: [LocalStrategy, JwtStrategy],
})
export class AuthModule {}
