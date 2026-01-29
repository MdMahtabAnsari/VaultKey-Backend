import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PageLimitDto {
  @ApiProperty({
    description: 'Page number for pagination (minimum 1)',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number;

  @ApiProperty({
    description: 'Number of items per page for pagination (minimum 1)',
    example: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number;
}
