import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'; // Added INestApplication
import { PrismaClient } from '@prisma/client'; // Keep this import, added Prisma for types

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('PrismaService initialized and connected to DB.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('PrismaService disconnected from DB.');
  }
}
