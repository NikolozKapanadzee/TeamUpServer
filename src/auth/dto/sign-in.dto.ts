import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'johndoe@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: 'gujakupreishvili123', required: true })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
