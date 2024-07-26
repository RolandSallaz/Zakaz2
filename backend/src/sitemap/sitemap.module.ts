import { Module } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { SitemapController } from './sitemap.controller';
import { ItemModule } from '@/item/item.module';

@Module({
  imports: [ItemModule],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
