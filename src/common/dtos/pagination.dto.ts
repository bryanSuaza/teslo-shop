/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // transformar 
  @Type( () => Number ) // enableImplicitConversion: true
  limit?: number;


  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type( () => Number )
  offset?: number;
}
