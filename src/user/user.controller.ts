import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtUserInfo, RequestUser } from '../auth/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AccessGuard } from '../auth/guard/access.guard';
import { USER_ERROR, UserException } from '../common/exception/user.exception';
import { RecoverDto } from './dto/recover.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { Throttle } from '@nestjs/throttler';
import { BigIntInterceptor } from '../common/interceptor/big-int.interceptor';

@UseInterceptors(BigIntInterceptor)
@Controller('api/user')
@UseGuards(AccessGuard)
@Throttle({ default: { limit: 2, ttl: 1000 } })
export class UserController {
  constructor(private readonly userService: UserService) {}

  // /user
  @Patch()
  async update(
    @RequestUser() requestUser: JwtUserInfo,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!requestUser || requestUser.role?.includes('admin')) {
      throw new UserException(USER_ERROR.PERMISSION_DENIED);
    }
    return this.userService.update(requestUser, updateUserDto, response);
  }

  // /user
  // return: clear-cookie('refreshToken')
  @Delete()
  async delete(
    @RequestUser() requestUser: JwtUserInfo,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!requestUser || requestUser.role?.includes('admin')) {
      throw new UserException(USER_ERROR.PERMISSION_DENIED);
    }
    return this.userService.delete(requestUser, response);
  }

  // /user/recover
  @Post('recover')
  recover(@Body() recoverDto: RecoverDto) {
    return this.userService.recover(recoverDto);
  }

  // /user/recover
  @Get('recover')
  recoverTokenCheck(@Query('token') token: string) {
    return this.userService.recoverTokenCheck(token);
  }

  // /user/recover/password
  @Post('recover/password')
  recoverPassword(
    @Query('token') token: string,
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ) {
    return this.userService.recoverPassword(token, recoverPasswordDto);
  }
}
