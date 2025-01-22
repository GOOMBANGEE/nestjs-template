import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalGuard } from './guard/local.guard';
import { RefreshGuard } from './guard/refresh.guard';
import { RequestUser } from './decorator/user.decorator';
import { Response } from 'express';
import { AccessGuard } from './guard/access.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // /auth/register
  // return {username, accessToken, accessTokenExpire}
  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(registerDto, response);
  }

  // /auth/login
  // @UseGuards(AuthGuard('local')) // auth/strategy/local.strategy.ts return user; => req.user = user
  @Post('login')
  @UseGuards(LocalGuard) // auth/guard/local.guard.ts => LocalGuard extends AuthGuard('local')
  @HttpCode(HttpStatus.OK)
  login(
    @RequestUser() request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(request, response);
  }

  // /auth/refresh
  @Get('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  refresh(@RequestUser() requestUser) {
    return this.authService.refreshToken(requestUser);
  }

  // /auth/logout
  @Get('logout')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
