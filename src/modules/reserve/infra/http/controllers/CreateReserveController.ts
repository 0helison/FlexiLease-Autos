import CreateReserveService from '@modules/reserve/services/CreateReserveService';
import { formatReserve } from '@modules/reserve/utils/dateUtils';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { parseDate } from '@shared/format/FormatDate';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { container } from 'tsyringe';

export default class CreateReserveController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { _id_user, _id_car, start_date, end_date } = request.body;

    const parsedStartDate = parseDate(start_date);
    const parsedEndDate = parseDate(end_date);

    const createReserve = container.resolve(CreateReserveService);

    const reserveData = await createReserve.execute({
      _id_user: new ObjectId(_id_user),
      _id_car: new ObjectId(_id_car),
      start_date: parsedStartDate,
      end_date: parsedEndDate,
    });

    const reserve = formatReserve(reserveData);

    return response.status(HttpStatusCode.CREATED).json(reserve);
  }
}
