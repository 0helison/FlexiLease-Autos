import { HttpStatusCode } from '@shared/enums/HttpStatusCode';

export class NotFoundError extends Error {
  public statusCode: number;
  public details: string[];

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.NOT_FOUND;
    this.details = [];
    this.name = 'NotFound';
  }
}
