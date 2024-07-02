import { BusinessError } from '@shared/errors/BusinessError';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { AuthenticationError } from '@shared/errors/AuthenticationError'; // Importe a classe AuthenticationError
import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from '@shared/consts/ErrorsConsts';
import { UNEXPECTED_ERROR } from '@shared/consts/ErrorMessagesConsts';

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof BusinessError) {
    return res.status(err.statusCode).json({
      code: err.statusCode || HttpStatusCode.BAD_REQUEST,
      status: BAD_REQUEST,
      message: err.message,
      details: err.details || [],
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      code: err.statusCode || HttpStatusCode.NOT_FOUND,
      status: NOT_FOUND,
      message: err.message,
      details: err.details || [],
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      status: UNAUTHORIZED,
      message: err.message,
      details: err.details || [],
    });
  }

  console.error('Erro não tratado:', err);
  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    status: INTERNAL_SERVER_ERROR,
    message: UNEXPECTED_ERROR,
    details: [],
  });
};
