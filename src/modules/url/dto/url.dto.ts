import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOriginalUrlDto {
  @ApiProperty({
    example: 'abc123',
    description: 'Short code to resolve the original URL',
  })
  @IsString()
  @IsNotEmpty()
  short_code: string;
}
