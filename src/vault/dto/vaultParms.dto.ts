import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VaultParamsDto {
  @ApiProperty({
    description: 'UUID of the vault',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  readonly id: string;
}
