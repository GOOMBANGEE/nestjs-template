import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { envKey } from 'src/common/const/env.const';
import { PrismaService } from 'src/common/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    const email = registerDto.email;
    const username = registerDto.username;
    const password = registerDto.password;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException('user already existing');
    }

    const saltOrRounds = this.configService.get(envKey.saltOrRounds);
    const hashedPassword = await bcrypt.hash(password, Number(saltOrRounds));

    const newUser = {
      email: email,
      username: username,
      password: hashedPassword,
    };

    await this.prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    return newUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = { email: user.email };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get(envKey.jwtSecret),
      }),
    };
  }
}
