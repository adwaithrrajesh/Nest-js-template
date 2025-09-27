import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Database error';
    let error = 'PrismaError';
    let statusCode = HttpStatus.BAD_REQUEST;

    switch (exception.code) {
      case 'P2002':
        message = `Unique constraint failed on field(s): ${exception.meta?.target}`;
        error = 'Conflict';
        statusCode = HttpStatus.CONFLICT;
        break;
      case 'P2025':
        message = 'Record not found';
        error = 'Not Found';
        statusCode = HttpStatus.NOT_FOUND;
        break;
      default:
        error = `Prisma Code ${exception.code}`;
    }

    response.status(statusCode).json({
      message,
      error,
      statusCode,
    });
  }
}
