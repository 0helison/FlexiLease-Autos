import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { BusinessError } from '@shared/errors/BusinessError';
import {
  JWT_INVALID,
  JWT_SECRET_MISSING,
  JWT_TOKEN_MISSING,
} from '@shared/consts/ErrorMessagesConsts';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new BusinessError(JWT_TOKEN_MISSING);
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = authConfig.jwt.secret;

    if (!secret) {
      throw new BusinessError(JWT_SECRET_MISSING);
    }

    const decodedToken = verify(token, secret) as ITokenPayload;

    const { sub } = decodedToken;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new BusinessError(JWT_INVALID);
  }
}
