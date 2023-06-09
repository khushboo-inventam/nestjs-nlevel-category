import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
// import * as Sentry from '@sentry/node';
import { ERROR } from './global-constants';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // console.log('exception', exception)
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) Sentry.captureException(exception);
    const error: string | any = exception instanceof HttpException ? exception.getResponse() : exception;
    const tempError = status !== HttpStatus.INTERNAL_SERVER_ERROR ? error : ERROR.INTERNAL_SERVER_ERROR;
    const errorMessage = typeof tempError === 'object' ? tempError.message : tempError;
    // const errorStack = typeof error === 'object' ? error.stack : null;

    console.log('status',status)
    console.log('errorMessage',errorMessage)
    return throwError(() => ({
        statusCode: status,
        message: errorMessage,
      }));
     }
}