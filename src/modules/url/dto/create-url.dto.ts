import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'Original URL to be shortened',
  })
  @IsUrl()
  @IsNotEmpty()
  original_url: string;

  @ApiPropertyOptional({
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID from decorator (optional)',
  })
  @IsUUID()
  @IsOptional()
  user_id?: string;
}
