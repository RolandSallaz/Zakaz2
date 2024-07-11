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
import { promises as fs } from 'fs';
import * as heicConvert from 'heic-convert';
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
        fileSize: 1024 * 1024 * 30, // Максимальный размер файла (30MB)
      },
    }),
  )
  public async uploadFiles(@UploadedFiles() files: Multer.File[]) {
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        let fileName = file.filename;
        let filePath = `public/uploads/${file.filename}`;

        if (file.originalname.endsWith('.heic')) {
          const inputBuffer = await fs.readFile(file.path);
          const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1,
          });

          fileName = file.filename.replace('.heic', '.jpg');
          filePath = `public/uploads/${fileName}`;
          await fs.writeFile(filePath, outputBuffer);
          await fs.unlink(file.path);
        }
        return {
          originalName: file.originalname,
          fileName,
          filePath,
        };
      }),
    );

    return compressedFiles;
  }
}
