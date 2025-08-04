import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateShortCode } from '../../helpers/code-generator';
import { UrlRepository } from './url.repository';
import { UpdateUrlDto } from './dto/update-url.dto';
import { GetUrlContract } from './contract/url.contract';

@Injectable()
export class UrlService {
  private BASE_URL: string;

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly configService: ConfigService,
  ) {
    this.BASE_URL = configService.getOrThrow<string>('BASE_URL');
  }

  async incrementAccessCount({ short_code }: GetUrlContract): Promise<void> {
    if (!short_code) {
      throw new Error('Short code is required to increment access count.');
    }

    await this.urlRepository.incrementAccessCount({ short_code });
  }

  //#region  GETS
  async getOriginalUrl(short_code: string): Promise<string | null> {
    if (!short_code) {
      throw new BadRequestException(
        'Short code is required to retrieve the original URL.',
      );
    }

    return await this.urlRepository.getOriginalUrl({ short_code });
  }

  async getUrlsByUser({ user_id }: { user_id: string }) {
    const urls = await this.urlRepository.getUrlsByUser(user_id);

    const formattedUrls = urls.map((url) => ({
      irl_id: url.url_id,
      original_url: url.original,
      short_url: `${this.BASE_URL}/${url.short_code}`,
      click_count: url.click_count,
      created_at: url.created_at,
      updated_at: url.updated_at,
    }));

    return formattedUrls;
  }

  //#endregion GETS

  //#region POSTS

  async shortenUrl(payload: CreateUrlDto) {
    const shortCode = generateShortCode(6);

    const url = await this.urlRepository.shortenUrl({
      original: payload.original_url,
      short_code: shortCode,
      user_id: payload.user_id,
    });

    return {
      shortUrl: `${this.BASE_URL}/${url.short_code}`,
    };
  }

  //#endregion POSTS

  //#region PUTS
  async updateUrl(payload: UpdateUrlDto) {
    const urlExists = await this.urlRepository.findUrlById(payload.url_id);

    if (!urlExists) {
      throw new Error(`URL with ID ${payload.url_id} does not exist.`);
    }

    const url = await this.urlRepository.updateUrl(payload);

    const formatted = {
      irl_id: url.url_id,
      original_url: url.original,
      short_url: `${this.BASE_URL}/${url.short_code}`,
      click_count: url.click_count,
      created_at: url.created_at,
      updated_at: url.updated_at,
    };

    return formatted;
  }
  //#endregion PUTS

  //#region DELETES
  async deleteUrl({ url_id }: { url_id: string }) {
    const urlExists = await this.urlRepository.findUrlById(url_id);

    if (!urlExists) {
      throw new Error(`URL with ID ${url_id} does not exist.`);
    }

    return this.urlRepository.deleteUrl(url_id);
  }

  //#endregion DELETES
}
