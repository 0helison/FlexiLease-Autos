import { INVALID_ID_FORMAT } from '@shared/consts/ErrorMessagesConsts';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

function validateObjectId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: INVALID_ID_FORMAT,
      details: [],
    });
  }

  next();
}

export default validateObjectId;
