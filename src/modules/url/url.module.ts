import { Module } from '@nestjs/common';

import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlRepository } from './url.repository';
import { UrlRedirectController } from './url-redirect.controller';

@Module({
  imports: [],
  controllers: [UrlController, UrlRedirectController],
  providers: [UrlService, UrlRepository],
})
export class UrlModule {}
