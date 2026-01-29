import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VaultItemDto {
  @ApiProperty({
    description: 'Key of the vault item',
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @ApiProperty({
    description: 'Value of the vault item',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}
