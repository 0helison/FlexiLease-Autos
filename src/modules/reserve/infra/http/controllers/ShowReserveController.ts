import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import ShowReserveService from '@modules/reserve/services/ShowReserveService';
import { formatDate } from '@shared/format/FormatDate';

export default class ShowReserveController {
  public async show(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const showReserveService = container.resolve(ShowReserveService);

    const reserveData = await showReserveService.execute({ _id });

    const reserve = {
      ...reserveData,
      start_date: formatDate(reserveData.start_date),
      end_date: formatDate(reserveData.end_date),
    };

    return response.status(HttpStatusCode.OK).json(reserve);
  }
}
