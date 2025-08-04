import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShortenUrlContract {
  @IsString()
  @IsNotEmpty()
  original: string;

  @IsString()
  @IsNotEmpty()
  short_code: string;

  @IsUUID()
  @IsOptional()
  user_id?: string;
}

export class UpdateUrlContract {
  @IsString()
  @IsNotEmpty()
  original_url: string;

  @IsUUID()
  @IsNotEmpty()
  url_id: string;
}

export class GetUrlContract {
  @IsString()
  @IsNotEmpty()
  short_code: string;
}
