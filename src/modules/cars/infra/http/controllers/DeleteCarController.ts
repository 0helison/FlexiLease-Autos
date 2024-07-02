import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import DeleteCarService from '@modules/cars/services/DeleteCarService';

export default class DeleteCarController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const deleteCar = container.resolve(DeleteCarService);

    await deleteCar.execute({ _id });

    return response.status(HttpStatusCode.NO_CONTENT).send();
  }
}
