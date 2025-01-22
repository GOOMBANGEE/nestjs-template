import {
  Body,
  Controller,
  Delete,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestUser } from '../auth/decorator/user.decorator';
import { AccessGuard } from '../auth/guard/access.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
@UseGuards(AccessGuard)
@ApiBearerAuth('accessToken')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // /user
  @Patch()
  async update(@RequestUser() user, @Body() req: UpdateUserDto) {
    await this.userService.update(user, req);
  }

  // /user
  @Delete()
  async delete(
    @RequestUser() user,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.userService.delete(user, response);
  }
}
