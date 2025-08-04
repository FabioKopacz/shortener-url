import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import type { Response } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Redirect')
@Controller()
export class UrlRedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to the original URL by short code' })
  @ApiParam({
    name: 'shortCode',
    type: 'string',
    description: 'Short code associated with the original URL',
    example: 'abc123',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);

    if (!originalUrl?.data) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlService.incrementAccessCount({ short_code: shortCode });

    return res.redirect(originalUrl?.data);
  }
}
