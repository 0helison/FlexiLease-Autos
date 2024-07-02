import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthUserService from '@modules/users/services/AuthUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { formatUser } from '@modules/users/utils/formatUtils';

export default class AuthController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authUserService = container.resolve(AuthUserService);

    const { user, token } = await authUserService.execute({
      email,
      password,
    });

    const formattedUser = formatUser(user);

    return response
      .status(HttpStatusCode.OK)
      .json({ user: formattedUser, token });
  }
}
