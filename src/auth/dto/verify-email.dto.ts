import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDTO {
  @ApiProperty({ example: 'johndoe@gmail.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: 607475, required: true })
  @IsNotEmpty()
  @IsString()
  otpCode: string;
}
