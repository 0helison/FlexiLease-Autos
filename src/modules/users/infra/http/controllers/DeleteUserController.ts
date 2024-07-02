import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import { ObjectId } from 'mongodb';

export default class DeleteUserController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({ _id });

    return response.status(HttpStatusCode.NO_CONTENT).send();
  }
}
