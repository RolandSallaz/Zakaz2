import { Controller, Get, Res } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { Response } from 'express';
@Controller('sitemap')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  get(@Res() res: Response) {
    return this.sitemapService.get(res);
  }
}
