import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsDefined()
  @IsNotEmpty()
  @IsObject()
  lookfor: {
    positions: string[];
  };
  @IsEmail()
  @IsNotEmpty()
  contact: string;
  @IsString()
  @IsOptional()
  city: string;
}
