import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ListCarService from '@modules/cars/services/ListCarService';

class ListCarController {
  public async index(request: Request, response: Response): Promise<Response> {
    const limit = request.query.limit ? Number(request.query.limit) : 5;
    const offset = request.query.offset ? Number(request.query.offset) : 0;

    const model = request.query.model as string | undefined;
    const color = request.query.color as string | undefined;
    const year = request.query.year as string | undefined;

    const value_per_day = request.query.value_per_day
      ? Number(request.query.value_per_day)
      : undefined;

    const number_of_passengers = request.query.number_of_passengers
      ? Number(request.query.number_of_passengers)
      : undefined;

    const accessories = request.query['accessories.description']
      ? Array.isArray(request.query['accessories.description'])
        ? (request.query['accessories.description'] as string[]).map(
            description => ({ description }),
          )
        : [{ description: request.query['accessories.description'] as string }]
      : undefined;

    const listCars = container.resolve(ListCarService);

    const carsData = await listCars.execute({
      limit,
      offset,
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
      accessories,
    });

    return response.status(HttpStatusCode.OK).json(carsData);
  }
}

export default ListCarController;
