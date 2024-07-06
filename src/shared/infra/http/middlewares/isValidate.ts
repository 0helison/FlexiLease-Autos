import { BAD_REQUEST } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map(error => ({
          field: error.path.join('.'),
          message: error.message,
        }));

        const errorMessage = details.map(error => error.message).join(', ');

        return res.status(HttpStatusCode.BAD_REQUEST).json({
          code: HttpStatusCode.BAD_REQUEST,
          status: BAD_REQUEST,
          message: errorMessage,
          details: details,
        });
      } else {
        next(err);
      }
    }
  };
