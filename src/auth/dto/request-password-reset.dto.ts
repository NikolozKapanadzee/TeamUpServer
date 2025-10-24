import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'johndoe@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
