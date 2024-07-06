import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import ShowReserveService from '@modules/reserve/services/ShowReserveService';
import { formatReserve } from '@modules/reserve/utils/dateUtils';

export default class ShowReserveController {
  public async show(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const showReserveService = container.resolve(ShowReserveService);

    const reserveData = await showReserveService.execute({ _id });

    const reserve = formatReserve(reserveData);

    return response.status(HttpStatusCode.OK).json(reserve);
  }
}
