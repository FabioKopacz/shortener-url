import { IsUrl, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  original_url: string;

  @IsUUID()
  @IsNotEmpty()
  url_id: string;
}
