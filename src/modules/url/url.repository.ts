import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateShortenUrlContract,
  GetUrlContract,
  UpdateUrlContract,
} from './contract/url.contract';

@Injectable()
export class UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findUrlById(urlId: string) {
    return await this.prisma.url.findUnique({ where: { url_id: urlId } });
  }

  public async incrementAccessCount({ short_code }: GetUrlContract) {
    return await this.prisma.url.update({
      where: { short_code: short_code },
      data: {
        click_count: { increment: 1 },
      },
    });
  }

  public async getOriginalUrl({ short_code }: GetUrlContract) {
    const record = await this.prisma.url.findUnique({
      where: { short_code: short_code, deleted_at: null },
      select: { original: true },
    });

    return record?.original || null;
  }

  public async getUrlsByUser(userId: string) {
    return await this.prisma.url.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      select: {
        url_id: true,
        original: true,
        short_code: true,
        click_count: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  public async shortenUrl(payload: CreateShortenUrlContract) {
    const url = await this.prisma.url.create({
      data: {
        original: payload.original,
        short_code: payload.short_code,
        user_id: payload.user_id,
      },
    });

    return url;
  }

  public async updateUrl(payload: UpdateUrlContract) {
    return await this.prisma.url.update({
      where: { url_id: payload.url_id },
      data: { original: payload.original_url },
      select: {
        url_id: true,
        original: true,
        short_code: true,
        click_count: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  public async deleteUrl(urlId: string) {
    return await this.prisma.url.update({
      where: { url_id: urlId },
      data: { deleted_at: new Date() },
    });
  }
}
