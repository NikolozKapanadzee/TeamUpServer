import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'OpenAi', required: true })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    example:
      'OpenAI is an advanced artificial intelligence research and development project focused on creating powerful and safe AI technologies that can understand, reason, and generate human-like content. The project explores cutting-edge innovations in natural language processing, machine learning, and deep neural networks to develop systems capable of conversation, content creation, data analysis, and problem-solving.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty({
    example: ['Backend Developer', 'Frontend Developer'],
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  lookfor: string[];
  @ApiProperty({ example: 'example@gmail.com', required: true })
  @IsEmail()
  @IsNotEmpty()
  contact: string;
  @ApiProperty({ example: 'Tbilisi' })
  @IsString()
  @IsOptional()
  city: string;
}
