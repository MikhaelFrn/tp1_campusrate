import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type NestErrorBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : undefined;

    const body: NestErrorBody =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
        ? (exceptionResponse as NestErrorBody)
        : {};

    const messages = Array.isArray(body.message)
      ? body.message
      : body.message
        ? [body.message]
        : [];

    const title = this.getTitle(status);

    response
      .status(status)
      .type('application/problem+json')
      .json({
        type: `http://localhost:${process.env.PORT ?? 3000}/problems/${this.getType(status)}`,
        title,
        status,
        detail:
          messages[0] ??
          (status === HttpStatus.INTERNAL_SERVER_ERROR
            ? 'An unexpected error occured'
            : title),
        instance: request.originalUrl,
        ...(messages.length > 1 ? { errors: messages } : {}),
      });
  }

  private getType(status: number): string {
    const types: Record<number, string> = {
      400: 'validation-error',
      404: 'not-found',
      409: 'conflict',
      415: 'unsupported-media-type',
      500: 'internal-error',
    };

    return types[status] ?? 'http-error';
  }

  private getTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Invalid data',
      404: 'Resource not found',
      409: 'Conflict',
      415: 'Unsuported media type',
      500: 'Internal error',
    };

    return titles[status] ?? 'HTTP error';
  }
}