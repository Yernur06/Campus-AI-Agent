import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
        'Unhandled exception',
      );
    }

    const message = this.getMessage(exception, responseBody);
    const error = this.getErrorName(statusCode, responseBody);

    response.status(statusCode).json({
      statusCode,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getMessage(exception: unknown, responseBody: unknown): string {
    if (typeof responseBody === 'string') {
      return responseBody;
    }

    if (this.isRecord(responseBody)) {
      const message = responseBody.message;
      if (typeof message === 'string') {
        return message;
      }
      if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === 'string').join('; ');
      }
    }

    return exception instanceof HttpException
      ? exception.message
      : 'Internal server error';
  }

  private getErrorName(statusCode: number, responseBody: unknown): string {
    if (this.isRecord(responseBody) && typeof responseBody.error === 'string') {
      return responseBody.error;
    }

    return HttpStatus[statusCode] ?? 'Error';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
