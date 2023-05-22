import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  RpcExceptionFilter,
} from "@nestjs/common";
// import * as Sentry from '@sentry/node';
import { throwError } from "rxjs";
import { ERROR } from "./global-constants";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // console.log('exception', exception)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) Sentry.captureException(exception);
    const error: string | any =
      exception instanceof HttpException ? exception.getResponse() : exception;
    const tempError =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? error
        : ERROR.INTERNAL_SERVER_ERROR;
    const errorMessage =
      typeof tempError === "object" ? tempError.message : tempError;
    // const errorStack = typeof error === 'object' ? error.stack : null;

    return throwError(() => ({
      statusCode: status,
      message: errorMessage,
    }));
  }
}
