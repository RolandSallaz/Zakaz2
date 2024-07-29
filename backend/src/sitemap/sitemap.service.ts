import { ItemService } from '@/item/item.service';
import { Injectable } from '@nestjs/common';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SitemapService {
  constructor(
    private itemService: ItemService,
    private configService: ConfigService,
  ) {}
  sitemapXmlCache;
  sitemapTimeoutMs = 1000 * 60 * 60;
  domain = `https://${this.configService.get<string>('DOMAIN') || 'localhost'}`;

  async get(res: Response) {
    res.set('Content-Type', 'text/xml'); //1 час кеш
    if (this.sitemapXmlCache) {
      res.send(this.sitemapXmlCache);
      return;
    }
    const items = await this.itemService.findAll();
    const smStream = new SitemapStream({
      hostname: this.domain,
    });
    items.forEach((item) => {
      smStream.write({
        url: `/items/${item.id}`,
        changefreq: 'monthly',
        priority: 1,
      });
    });
    smStream.end();
    streamToPromise(smStream).then((xml) => {
      res.send(xml);
    });
  }
}
