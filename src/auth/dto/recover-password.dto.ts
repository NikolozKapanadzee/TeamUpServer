import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RecoverPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
