import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryParamsDTO {
  @ApiProperty({ example: 2 })
  @IsOptional()
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  page: number = 1;
  @ApiProperty({ example: 15 })
  @IsOptional()
  @Transform(({ value }) => Math.min(Number(value), 30))
  @IsNumber()
  take: number = 15;
}
