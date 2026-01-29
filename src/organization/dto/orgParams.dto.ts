import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrgParamsDto {
  @ApiProperty({
    description: 'Unique identifier of the organization',
    example: 'org_1234567890',
  })
  @IsString()
  readonly id: string;
}
