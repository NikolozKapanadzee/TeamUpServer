import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  newPassword: string;
}
