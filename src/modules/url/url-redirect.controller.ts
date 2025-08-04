import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import type { Response } from 'express';

@Controller()
export class UrlRedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);

    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlService.incrementAccessCount({ short_code: shortCode });

    return res.redirect(originalUrl);
  }
}
