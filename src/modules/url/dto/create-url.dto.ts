import { IsUrl, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  original_url: string;

  @IsUUID()
  @IsOptional()
  user_id?: string;
}
