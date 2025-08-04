import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateShortCode } from '../../helpers/code-generator';
import { UrlRepository } from './url.repository';
import { UpdateUrlDto } from './dto/update-url.dto';
import { GetUrlContract } from './contract/url.contract';
import { BaseResponseDTO } from '../../common/dto/response.dto';
import { FormattedUrl } from './interface/url.interface';

@Injectable()
export class UrlService {
  private BASE_URL: string;

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly configService: ConfigService,
  ) {
    this.BASE_URL = configService.getOrThrow<string>('BASE_URL');
  }

  async incrementAccessCount({ short_code }: GetUrlContract) {
    if (!short_code) {
      throw new Error('Short code is required to increment access count.');
    }

    await this.urlRepository.incrementAccessCount({ short_code });
  }

  //#region GETS
  async getOriginalUrl(short_code: string): Promise<BaseResponseDTO<string>> {
    if (!short_code) {
      throw new BadRequestException(
        'Short code is required to retrieve the original URL.',
      );
    }

    const originalUrl = await this.urlRepository.getOriginalUrl({ short_code });

    if (!originalUrl) {
      throw new BadRequestException('Short URL not found.');
    }

    return new BaseResponseDTO({
      data: originalUrl,
      message: 'Original URL retrieved',
    });
  }

  async getUrlsByUser({
    user_id,
  }: {
    user_id: string;
  }): Promise<BaseResponseDTO<FormattedUrl[]>> {
    const urls = await this.urlRepository.getUrlsByUser(user_id);

    const formattedUrls = urls.map((url) => ({
      url_id: url.url_id,
      original_url: url.original,
      short_url: `${this.BASE_URL}/${url.short_code}`,
      click_count: url.click_count,
      created_at: url.created_at,
      updated_at: url.updated_at,
    }));

    return new BaseResponseDTO({
      data: formattedUrls,
      message: 'User URLs retrieved successfully',
    });
  }
  //#endregion GETS

  //#region POSTS
  async shortenUrl(payload: CreateUrlDto): Promise<BaseResponseDTO<string>> {
    const shortCode = generateShortCode(6);

    const url = await this.urlRepository.shortenUrl({
      original: payload.original_url,
      short_code: shortCode,
      user_id: payload.user_id,
    });

    return new BaseResponseDTO({
      data: `${this.BASE_URL}/${url.short_code}`,
      message: 'URL shortened successfully',
    });
  }
  //#endregion POSTS

  //#region PUTS
  async updateUrl(
    payload: UpdateUrlDto,
  ): Promise<BaseResponseDTO<FormattedUrl>> {
    const urlExists = await this.urlRepository.findUrlById(payload.url_id);

    if (!urlExists) {
      throw new Error(`URL with ID ${payload.url_id} does not exist.`);
    }

    if (urlExists?.user_id !== payload.user_id) {
      throw new BadRequestException(
        'You do not have permission to delete this URL.',
      );
    }

    const url = await this.urlRepository.updateUrl(payload);

    const formatted = {
      url_id: url.url_id,
      original_url: url.original,
      short_url: `${this.BASE_URL}/${url.short_code}`,
      click_count: url.click_count,
      created_at: url.created_at,
      updated_at: url.updated_at,
    };

    return new BaseResponseDTO({
      data: formatted,
      message: 'URL updated successfully',
    });
  }
  //#endregion PUTS

  //#region DELETES
  async deleteUrl({
    url_id,
    user_id,
  }: {
    url_id: string;
    user_id?: string;
  }): Promise<BaseResponseDTO> {
    const urlExists = await this.urlRepository.findUrlById(url_id);

    if (!urlExists) {
      throw new Error(`URL with ID ${url_id} does not exist.`);
    }

    if (urlExists?.user_id !== user_id) {
      throw new BadRequestException(
        'You do not have permission to delete this URL.',
      );
    }

    await this.urlRepository.deleteUrl(url_id);
    return new BaseResponseDTO({
      message: 'URL deleted successfully',
      code: HttpStatus.NO_CONTENT,
    });
  }
  //#endregion DELETES
}
