import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowUserService from '@modules/users/services/ShowUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import { formatUser } from '@modules/users/utils/formatUtils';

export default class ShowUserController {
  public async show(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const showUserService = container.resolve(ShowUserService);

    const userData = await showUserService.execute({ _id });

    const user = formatUser(userData);

    return response.status(HttpStatusCode.OK).json(user);
  }
}
