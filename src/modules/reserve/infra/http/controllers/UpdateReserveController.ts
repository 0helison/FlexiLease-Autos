import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import UpdateReserveService from '@modules/reserve/services/UpdateReserveService';
import { parseDate } from '@shared/format/FormatDate';
import { formatReserve } from '@modules/reserve/utils/dateUtils';

export default class UpdateReserveController {
  public async update(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const { _id_user, _id_car, start_date, end_date } = request.body;

    const parsedStartDate = parseDate(start_date);
    const parsedEndDate = parseDate(end_date);

    const updateReserveService = container.resolve(UpdateReserveService);

    const reserveData = await updateReserveService.execute({
      _id,
      _id_user: new ObjectId(_id_user),
      _id_car: new ObjectId(_id_car),
      start_date: parsedStartDate,
      end_date: parsedEndDate,
    });

    const reserve = formatReserve(reserveData);

    return response.status(HttpStatusCode.OK).json(reserve);
  }
}
