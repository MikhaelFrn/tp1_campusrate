import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type HttpErrorBody = {
  message?: string | string[];
  error?: string;
};

@Catch(HttpException)
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name); 

  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let message: string | string[] = exception.message;
    let error = exception.name;

    const title = this.getTitle(statusCode);
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const body = exceptionResponse as HttpErrorBody;
      message = body.message ?? message;
      error = body.error ?? error;
    }

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.originalUrl} - Status: ${statusCode} - Message: ${JSON.stringify(message)}`,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.originalUrl} - Status: ${statusCode} - Message: ${JSON.stringify(message)}`,
      );
    }

    response.status(statusCode).json({
      statusCode,
      error,
      type: this.getType(statusCode),
      message,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }

  private getType(status: number): string {
    const types: Record<number, string> = {
      400: 'validation-error',
      404: 'not-found',
      409: 'conflict',
      413: 'payload-too-large',
      415: 'unsuported-media-type',
      500: 'internal-error',
    };

    return types[status] ?? 'http-error';
  }

  private getTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Invalid data',
      404: 'Resource not found',
      409: 'Conflict',
      413: 'Payload too large',
      415: 'Unsuported media type',
      500: 'Internal error',
    };

    return titles[status] ?? 'HTTP error';
  }
}