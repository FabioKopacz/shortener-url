import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUrlDto {
  @ApiProperty({
    example: 'https://newurl.com',
    description: 'Updated original URL',
  })
  @IsUrl()
  @IsNotEmpty()
  original_url: string;

  @ApiProperty({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'URL ID to update',
  })
  @IsUUID()
  @IsNotEmpty()
  url_id: string;
}
