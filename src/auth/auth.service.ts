import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { envKey } from 'src/common/const/env.const';
import { PrismaService } from 'src/common/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { Logger } from 'winston';
import { User } from '@prisma/client';
import { Response } from 'express';
import { CookieOptions } from 'express-serve-static-core';

@Injectable()
export class AuthService {
  private readonly saltOrRounds: number;
  private readonly accessTokenType: string;
  private readonly accessTokenExpires: number;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenType: string;
  private readonly refreshTokenExpires: number;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.accessTokenType = this.configService.get(envKey.accessToken);
    this.accessTokenExpires = this.configService.get(envKey.accessTokenExpires);
    this.accessTokenSecret = this.configService.get(envKey.accessTokenSecret);
    this.refreshTokenType = this.configService.get(envKey.refreshToken);
    this.refreshTokenExpires = this.configService.get(
      envKey.refreshTokenExpires,
    );
    this.refreshTokenSecret = this.configService.get(envKey.refreshTokenSecret);
    this.saltOrRounds = Number(this.configService.get(envKey.saltOrRounds));
  }

  async register(registerDto: RegisterDto, response: Response) {
    const email = registerDto.email;
    const username = registerDto.username;
    const password = registerDto.password;
    const confirmPassword = registerDto.confirmPassword;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException('user already existing');
    }
    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);

    const user = await this.prisma.user.create({
      data: { email, username, password: hashedPassword },
    });
    return this.generateToken(user.id, user.username, response);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = { ...user };
      delete result.password;
      return result;
    }
    return null;
  }

  async generateToken(userId: number, username: string, response: Response) {
    const accessTokenExpires = this.accessTokenExpires;
    // expiresIn => 1s단위 => 3600 => 1h
    const accessToken = await this.jwtService.signAsync(
      { id: userId, username, type: this.accessTokenType },
      { secret: this.accessTokenSecret, expiresIn: accessTokenExpires },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: userId, username, type: this.refreshTokenType },
      { secret: this.refreshTokenSecret, expiresIn: this.refreshTokenExpires },
    );

    // maxAge => (Date.now() +) this.refreshTokenExpires (ms)
    const cookieOptions: CookieOptions = {
      httpOnly: true, // can't be accessed by JavaScript => reduces XSS risk
      secure: process.env.NODE_ENV === 'production', // send only over HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : undefined, // CSRF protection
      maxAge: this.refreshTokenExpires * 1000, // set cookie expiration
    };
    response.cookie('refreshToken', refreshToken, cookieOptions);

    return { username, accessToken, accessTokenExpires };
  }

  // /auth/login
  async login(user: User, response: Response) {
    return this.generateToken(user.id, user.username, response);
  }

  // /auth/refresh
  async refreshToken(requestUser) {
    if (requestUser.type !== this.refreshTokenType) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const username = requestUser.username;
    const accessTokenExpires = this.accessTokenExpires;
    const accessToken = await this.jwtService.signAsync(
      {
        id: requestUser.id,
        username: requestUser.username,
        type: this.accessTokenType,
      },
      { secret: this.accessTokenSecret, expiresIn: accessTokenExpires },
    );

    return { username, accessToken, accessTokenExpires };
  }

  // /auth/logout
  async logout(response: Response) {
    response.clearCookie('refreshToken');
  }
}
