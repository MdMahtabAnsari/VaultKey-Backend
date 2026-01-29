import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CursorDto {
  @ApiProperty({
    description: 'Cursor for pagination',
    example: 'eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCJ9',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly cursor?: string;

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

export class CursorIdentifierDto extends CursorDto {
  @ApiProperty({
    description: 'Optional identifier for filtering results',
    example: 'org_1234567890',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly identifier?: string;
}
