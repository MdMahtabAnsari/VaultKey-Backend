import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VaultItemDto } from './vaultItem.dto';

export class UpdateVaultDto {
  @ApiProperty({
    description: 'UUID of the vault',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 'org_1234567890',
  })
  @IsString()
  @IsNotEmpty()
  readonly organizationId: string;

  @ApiProperty({
    description: 'Name of the vault',
    example: 'Personal Vault',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    description: 'Description of the vault',
    example: 'This vault contains personal passwords and notes.',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'Array of vault items (key-value pairs)',
    type: [VaultItemDto],
    example: [
      { key: 'username', value: 'john_doe' },
      { key: 'password', value: 'SecurePass123!' },
    ],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VaultItemDto)
  readonly items?: VaultItemDto[];
}
