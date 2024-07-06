import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import UpdateCarService from '@modules/cars/services/UpdateCarService';

export default class UpdateCarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const { model, color, year, value_per_day, number_of_passengers } =
      request.body;

    const updateCar = container.resolve(UpdateCarService);

    const carData = await updateCar.execute({
      _id,
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
    });

    return response.status(HttpStatusCode.OK).json(carData);
  }
}
