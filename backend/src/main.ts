import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { TypeOrmErrorMapperInterceptor } from './common/typeormerrormapper.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.setGlobalPrefix(configService.get('isDev') ? '' : 'api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });
  // app.use(bodyParser.json({ limit: '10mb' })); // Установка максимального размера тела запроса
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TypeOrmErrorMapperInterceptor());
  await app.listen(port, () => console.log('Server started'));
}
bootstrap();
