import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';
import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';

@Controller('files')
export class FilesController {
  constructor() {}
  @Post()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const extension = file.originalname.split('.').pop();
          const randomName = uuidv4();
          const randomFileName = `${randomName}.${extension}`;
          cb(null, randomFileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 30, // Максимальный размер файла (30MB)
      },
    }),
  )
  public async uploadFiles(@UploadedFiles() files: Multer.File[]) {
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        return {
          originalName: file.originalname,
          fileName: file.filename,
          filePath: `public/uploads/${file.filename}`,
        };

        // компрессия
        const tempFilePath = `public/uploads/temp-${file.filename}`;
        const originalFilePath = file.path;

        // Сжимаем изображение и временно сохраняем его
        await sharp(file.path)
          .resize(800) // Пример изменения размера, если нужно
          .toFormat('jpeg', { quality: 100 })
          .toFile(tempFilePath);

        // Удаляем оригинальный файл
        await fs.unlink(originalFilePath);

        // Переименовываем сжатый файл в оригинальное имя файла
        await fs.rename(tempFilePath, originalFilePath);

        return {
          originalName: file.originalname,
          fileName: file.filename,
          filePath: `public/uploads/${file.filename}`,
        };
      }),
    );

    return compressedFiles;
  }
}
