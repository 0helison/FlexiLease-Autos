import { HttpStatusCode } from '@shared/enums/HttpStatusCode';

export class BusinessError extends Error {
  public statusCode: number;
  public details: string[];

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.BAD_REQUEST;
    this.details = [];
    this.name = 'BusinessError';
  }
}
