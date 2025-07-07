import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private validationTokens: Map<string, number> = new Map(); // token:expiaryTime as k,v pair

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(phoneNumber: string): Promise<{ validationToken: string }> {
    const user = await this.userRepository.findOrCreateUser(phoneNumber);

    const validationToken = this.jwtService.sign(
      { userId: user.id },
      {
        secret: this.configService.get<string>('TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('TOKEN_EXPIRATION'),
      },
    );
    const expiresAt = Date.now() + 2 * 60 * 1000;
    this.validationTokens.set(user.id, expiresAt);

    return { validationToken };
  }

  async verifyPhone(
    otp: string,
    validationToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (otp !== '12345') {
      throw new BadRequestException('Invalid OTP');
    }

    let payload;
    try {
      // console.log('validationToken: ', validationToken);

      payload = await this.jwtService.verifyAsync(validationToken, {
        secret: this.configService.get<string>('TOKEN_SECRET'),
      });
      // console.log('Payload: ', payload);
    } catch {
      throw new UnauthorizedException('Invalid or expired validation token');
    }

    console.log('validationToken: ', validationToken);

    const expiresAt = this.validationTokens.get(payload.userId);
    // console.log('storedToken: ', expiresAt);
    if (!expiresAt || expiresAt < Date.now()) {
      throw new UnauthorizedException('Invalid or expired validation token');
    }

    this.validationTokens.delete(payload.userId);

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = await this.jwtService.signAsync(
      { userId: user.id, phoneNumber: user.phoneNumber, role: user.role },
      {
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        // secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      },
    );

    return { accessToken, refreshToken };
  }

  async getMe(
    token: string,
  ): Promise<{ userId: string; phoneNumber: string; role: string }> {
    let payload: { userId: string; phoneNumber: string; role: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }
}
