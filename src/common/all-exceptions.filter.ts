import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
// import * as Sentry from '@sentry/node';
import { ERROR } from './global-constants';
import { catchError, throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
     console.log('exception', exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) Sentry.captureException(exception);
    const error: string | any = exception instanceof HttpException ? exception.getResponse() : exception;
    const tempError = status !== HttpStatus.INTERNAL_SERVER_ERROR ? error : ERROR.INTERNAL_SERVER_ERROR;
    const errorMessage = typeof tempError === 'object' ? tempError.message : tempError;
    // const errorStack = typeof error === 'object' ?   error.stack : null;

    // console.log('request', request)
    console.log('errorMessage', errorMessage)
    if(request?.protocol?.includes('http') )
    {
      console.log("statuss: ", status, 'errorMessagee: ', errorMessage)
      response.status(status).json({
        statusCode: status,
        message: errorMessage,
      });
    }else{
      console.log("statusss: ", status, 'errorMessageee: ', errorMessage)
      return throwError(() => ({
        statusCode: status,
        message: errorMessage,
      }));

    }


  }
}