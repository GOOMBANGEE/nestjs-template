import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
