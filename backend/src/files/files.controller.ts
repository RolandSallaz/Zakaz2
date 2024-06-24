import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FilesController {
  constructor() {}
  // upload single file
  @Post()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const extension = file.originalname.split('.').pop(); // Получаем расширение файла
          const randomName = uuidv4(); // Генерируем случайное имя файла
          const randomFileName = `${randomName}.${extension}`; // Соединяем случайное имя и расширение
          cb(null, randomFileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // Установите максимальный размер файла (10MB в данном случае)
      },
    }),
  )
  public async uploadFile(@UploadedFile() file) {
    return file;
  }
}
