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
import { v4 as uuidv4 } from 'uuid';

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
        fileSize: 1024 * 1024 * 10, // Максимальный размер файла (10MB)
      },
    }),
  )
  public async uploadFiles(@UploadedFiles() files: Multer.File[]) {
    return files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: `public/uploads/${file.filename}`,
    }));
  }
}
