import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class FilterPostsDto {
  @IsOptional()
  @IsString()
  city: string;

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

  @IsOptional()
  @IsIn(['24hrs', 'week', 'month', 'anytime'])
  timeFilter: '24hrs' | 'week' | 'month' | 'anytime';
}
