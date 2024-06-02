import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface IErrorEx extends Error {
  code: number;
  detail: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: IErrorEx, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let ex;
    console.log(exception);
    if (exception.code == 23505) {
      ex = new HttpException(exception.detail, 409);
    } else if (exception instanceof PayloadTooLargeException) {
      ex = new HttpException('Размер файла превышает допустимый', 413);
    } else if (exception instanceof HttpException) {
      ex = exception;
    } else {
      ex = new InternalServerErrorException(`Что-то пошло не так`);
    }
    const httpStatus = ex.getStatus();
    response.status(httpStatus).json({
      message: ex.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: httpStatus,
    });
  }
}
