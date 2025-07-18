import {
  IsArray,
  IsDefined,
  IsEmail,
  IsNotEmpty,
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
  @IsArray()
  lookfor: string[];
  @IsEmail()
  @IsNotEmpty()
  contact: string;
  @IsString()
  @IsOptional()
  city: string;
}
