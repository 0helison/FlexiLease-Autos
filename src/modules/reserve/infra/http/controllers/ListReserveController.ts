import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ListReserveService from '@modules/reserve/services/ListReserveService';
import { ObjectId } from 'mongodb';
import { formatReserves } from '@modules/reserve/utils/dateUtils';
import { parseDateParams } from '@shared/format/FormatDate';

class ListReserveController {
  public async index(request: Request, response: Response): Promise<Response> {
    const limit = request.query.limit ? Number(request.query.limit) : 5;
    const offset = request.query.offset ? Number(request.query.offset) : 0;

    const _id_user = request.query._id_user
      ? new ObjectId(request.query._id_user as string)
      : undefined;
    const _id_car = request.query._id_car
      ? new ObjectId(request.query._id_car as string)
      : undefined;

    const start_date = request.query.start_date
      ? parseDateParams(request.query.start_date as string)
      : undefined;

    const end_date = request.query.end_date
      ? parseDateParams(request.query.end_date as string)
      : undefined;

    const final_value = request.query.final_value
      ? Number(request.query.final_value)
      : undefined;

    const listReserve = container.resolve(ListReserveService);

    const reservesData = await listReserve.execute({
      limit,
      offset,
      _id_user,
      _id_car,
      start_date,
      end_date,
      final_value,
    });

    const formattedReserve = formatReserves(reservesData.reserves);

    const listReserves = {
      reserves: formattedReserve,
      limit: reservesData.limit,
      offset: reservesData.offset,
      total: reservesData.total,
      offsets: reservesData.offsets,
    };

    return response.status(HttpStatusCode.OK).json(listReserves);
  }
}

export default ListReserveController;
