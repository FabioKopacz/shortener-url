import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guard/optional-jwt-auth.guard';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { CurrentUserDto } from '../auth/interface/current-user.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@ApiTags('URL')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all URLs of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of URLs returned successfully',
  })
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getUrls(@CurrentUser() user: CurrentUserDto) {
    return this.urlService.getUrlsByUser({ user_id: user?.user_id });
  }

  @ApiOperation({ summary: 'Shorten a new URL (with optional authentication)' })
  @ApiResponse({ status: 201, description: 'URL shortened successfully' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post('shorten')
  shortenUrl(@Body() body: CreateUrlDto, @CurrentUser() user?: CurrentUserDto) {
    return this.urlService.shortenUrl({ ...body, user_id: user?.user_id });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a shortened URL by ID' })
  @ApiResponse({ status: 200, description: 'URL updated successfully' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateUrl(
    @Param('id') urlId: string,
    @Body() body: Pick<UpdateUrlDto, 'original_url'>,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.urlService.updateUrl({
      ...body,
      url_id: urlId,
      user_id: user.user_id,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a shortened URL by ID' })
  @ApiResponse({ status: 204, description: 'URL deleted successfully' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUrl(@Param('id') urlId: string, @CurrentUser() user: CurrentUserDto) {
    return this.urlService.deleteUrl({ url_id: urlId, user_id: user.user_id });
  }
}
