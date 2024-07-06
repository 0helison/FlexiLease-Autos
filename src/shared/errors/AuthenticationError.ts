import { HttpStatusCode } from '@shared/enums/HttpStatusCode';

export class AuthenticationError extends Error {
  public statusCode: number;
  public details: string[];

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCode.UNAUTHORIZED;
    this.details = [];
    this.name = 'AuthenticationError';
  }
}
