import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\+\d{1,3}\d{10}$/, {
    message:
      'Phone number must be in international format (+[country code][10-digit number])',
  })
  phoneNumber: string;
}

export class VerifyPhoneDto {
  @IsString()
  @Matches(/^\d{5}$/, { message: 'OTP must be exactly 5 digits' })
  otp: string;
}