import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import ShowCarService from '@modules/cars/services/ShowCarService';

export default class ShowCarController {
  public async show(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const showCarService = container.resolve(ShowCarService);

    const car = await showCarService.execute({ _id });

    return response.status(HttpStatusCode.OK).json(car);
  }
}
