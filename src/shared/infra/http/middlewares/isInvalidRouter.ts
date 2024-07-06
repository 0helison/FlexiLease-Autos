import { BAD_REQUEST } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';

function isInvalidRoute(req: Request, res: Response, next: NextFunction) {
  res.status(HttpStatusCode.NOT_FOUND).json({
    code: HttpStatusCode.NOT_FOUND,
    status: BAD_REQUEST,
    message: `Router '${req.originalUrl}' non-existent.`,
    details: [],
  });
}

export { isInvalidRoute };
