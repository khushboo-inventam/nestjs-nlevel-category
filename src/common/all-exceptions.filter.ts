import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
// import * as Sentry from '@sentry/node';
import { throwError } from 'rxjs';
import { ERROR } from './global-constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // console.log('exception', exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) Sentry.captureException(exception);
    let error: string | any;
    if (exception instanceof HttpException) {
      error = exception.getResponse();
    } else if (exception instanceof UnauthorizedException) {
      error = {
        status: HttpStatus.UNAUTHORIZED,
        message: ERROR.UNAUTHORIZED_ERROR,
      };
    }
    const tempError =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? error
        : ERROR.INTERNAL_SERVER_ERROR;
    const errorMessage =
      typeof tempError === 'object' ? tempError.message : tempError;
    // const errorStack = typeof error === 'object' ? error.stack : null;

    if (request?.protocol?.includes('http'))
      response.status(status).json({
        statusCode: status,
        message: errorMessage,
      });

    return throwError(() => ({
      statusCode: status,
      message: errorMessage,
    }));
  }
}
