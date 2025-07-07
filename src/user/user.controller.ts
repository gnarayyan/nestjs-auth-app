import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, VerifyPhoneDto } from './dto';
import { AuthGuard } from './auth.guard';
import { ValidationTokenInterceptor } from './validation-token.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.phoneNumber);
  }

  @Post('verifyPhone')
  @UseInterceptors(ValidationTokenInterceptor)
  async verifyPhone(
    @Body() verifyPhoneDto: VerifyPhoneDto,
    @Headers('validationToken') validationToken: string,
  ) {
    return this.userService.verifyPhone(verifyPhoneDto.otp, validationToken);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.userService.getMe(token);
  }
}
