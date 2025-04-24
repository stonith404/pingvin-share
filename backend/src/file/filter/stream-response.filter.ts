import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class StreamResponseFilter implements ExceptionFilter {
  private readonly logger = new Logger(StreamResponseFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (response.headersSent) {
      this.logger.warn(
        `Headers already sent - exception thrown during streaming. Path: ${request.url}, Status: ${status}`,
      );

      // The response has already started streaming, cannot send JSON error
      // Just log the error and ensure the stream is properly terminated
      response.end();
      return;
    }

    // If headers not sent yet, handle normally with JSON response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
