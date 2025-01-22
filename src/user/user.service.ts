import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { envKey } from '../common/const/env.const';
import { Response } from 'express';

@Injectable()
export class UserService {
  private readonly saltOrRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.saltOrRounds = Number(this.configService.get(envKey.saltOrRounds));
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(user, req: UpdateUserDto) {
    this.logger.debug(`User update user: ${JSON.stringify(user)}`);
    this.logger.debug(JSON.stringify(req));
    if (req.password !== req.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = await bcrypt.hash(req.password, this.saltOrRounds);

    await this.prisma.user.update({
      where: { username: user.username },
      data: { password: hashedPassword },
    });
  }

  async delete(user, response: Response): Promise<void> {
    response.clearCookie('refreshToken');
    await this.prisma.user.delete({ where: { username: user.username } });
  }
}
