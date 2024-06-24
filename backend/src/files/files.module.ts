import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';

@Module({
  imports: [UsersModule],
  controllers: [FilesController],
})
export class FilesModule {}
