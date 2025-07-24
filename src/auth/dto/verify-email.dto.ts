import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
