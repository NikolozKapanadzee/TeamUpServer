import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterPostsDto {
  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  position: string;

  @IsOptional()
  @IsIn(['24hrs', 'week', 'month', 'anytime'])
  timeFilter: '24hrs' | 'week' | 'month' | 'anytime';
}
