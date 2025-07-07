import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(phoneNumber: string): Promise<User> {
    return this.prisma.user.upsert({
      where: { phoneNumber },
      update: {},
      create: {
        phoneNumber,
        role: 'User',
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
