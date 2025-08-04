import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { CurrentUserDto } from '../auth/interface/current-user.dto';
import { OptionalJwtAuthGuard } from '../../common/guard/optional-jwt-auth.guard';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  getUrls(@CurrentUser() user: CurrentUserDto) {
    return this.urlService.getUrlsByUser({ user_id: user?.user_id });
  }

  @Post('shorten')
  @UseGuards(OptionalJwtAuthGuard)
  shortenUrl(@Body() body: CreateUrlDto, @CurrentUser() user?: CurrentUserDto) {
    return this.urlService.shortenUrl({ ...body, user_id: user?.user_id });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUrl(
    @Param('id') urlId: string,
    @Body() body: Pick<UpdateUrlDto, 'original_url'>,
  ) {
    return this.urlService.updateUrl({
      ...body,
      url_id: urlId,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUrl(@Param('id') urlId: string) {
    return this.urlService.deleteUrl({
      url_id: urlId,
    });
  }
}
