import CreateCarService from '@modules/cars/services/CreateCarService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CreateCarController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
      accessories,
    } = request.body;

    const createCar = container.resolve(CreateCarService);

    const carData = await createCar.execute({
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
      accessories,
    });

    return response.status(HttpStatusCode.CREATED).json(carData);
  }
}
