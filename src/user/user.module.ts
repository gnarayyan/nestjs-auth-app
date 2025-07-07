import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ValidationTokenInterceptor } from './validation-token.interceptor';
import { UserRepository } from './user.repository';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    AuthGuard,
    ValidationTokenInterceptor,
    UserRepository,
  ],
})
export class UserModule {}
