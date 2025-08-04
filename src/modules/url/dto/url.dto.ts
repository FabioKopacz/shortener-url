import { IsNotEmpty, IsString } from 'class-validator';

export class GetOriginalUrlDto {
  @IsString()
  @IsNotEmpty()
  short_code: string;
}
