import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import UpdateAccessoryService from '@modules/cars/services/UpdateAccessoriesService';

export default class UpdateAccessoriesController {
  public async patch(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const _id_accessory = new ObjectId(request.params.accessoryId);

    const { description } = request.body;

    const updateAccessories = container.resolve(UpdateAccessoryService);

    const carData = await updateAccessories.execute({
      _id,
      _id_accessory,
      description,
    });

    return response.status(HttpStatusCode.OK).json(carData);
  }
}
