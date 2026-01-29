import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VaultItemDto } from './vaultItem.dto';

export class CreateVaultDto {
  @ApiProperty({
    description: 'Name of the vault',
    example: 'Personal Vault',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Description of the vault',
    example: 'This vault contains personal passwords and notes.',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 'org_1234567890',
  })
  @IsString()
  @IsNotEmpty()
  readonly organizationId: string;

  @ApiProperty({
    description: 'Array of vault items (key-value pairs)',
    type: [VaultItemDto],
    example: [
      { key: 'username', value: 'john_doe' },
      { key: 'password', value: 'SecurePass123!' },
      { key: 'url', value: 'https://example.com' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VaultItemDto)
  readonly items: VaultItemDto[];
}
