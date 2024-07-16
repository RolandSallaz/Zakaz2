import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtConfigModule } from './auth/config/jwt-config.module';
import { ItemModule } from './item/item.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ItemSelectorsModule } from './item-selectors/item-selectors.module';
import { AttachUserMiddleware } from './auth/middlewares/AttachUserMiddleware';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtConfigModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => [
        {
          rootPath: join(__dirname, '../../'),
          serveRoot: configService.get('isDev') ? '' : '/api',
          exclude: ['/api*', '*'], // Исключаем маршруты API
        },
      ],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ItemModule,
    FilesModule,
    ItemSelectorsModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttachUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
