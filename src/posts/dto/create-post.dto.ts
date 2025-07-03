import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsObject,
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
  lookfor: Record<string, string>;
  @IsEmail()
  @IsNotEmpty()
  contact: string;
}
