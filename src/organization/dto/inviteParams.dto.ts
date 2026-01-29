import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteParamsDto {
  @ApiProperty({
    description: 'Unique identifier of the invitation',
    example: 'invite_1234567890',
  })
  @IsString()
  readonly id: string;
}
