import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class FilterPostsDto {
  @ApiProperty({ example: 'Tbilisi' })
  @IsOptional()
  @IsString()
  city: string;
  @ApiProperty({ example: 'Web Developer', type: Array })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    if (Array.isArray(value)) {
      return value;
    }
    return undefined;
  })
  @IsArray()
  @IsString({ each: true })
  lookfor: string[];
  @ApiProperty({ example: 'week' })
  @IsOptional()
  @IsIn(['24hrs', 'week', 'month', 'anytime'])
  timeFilter: '24hrs' | 'week' | 'month' | 'anytime';
}
