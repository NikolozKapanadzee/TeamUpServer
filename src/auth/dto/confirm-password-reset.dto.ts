import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmPasswordResetDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjQ5ZTU3Y2JhNDJhYzZkMDQ4YmI1MCIsImlhdCI6MTc1NjY2ODUxMywiZXhwIjoxNzU2NjcyMTEzfQ.dTqs6O07QRB_7b3wuHcROekpiLH43ux8yY3cH-w2BG4',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
  @ApiProperty({ example: 'gujakupreishvili123', required: true })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  newPassword: string;
}
