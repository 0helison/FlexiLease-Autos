import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import DeleteReserveService from '@modules/reserve/services/DeleteReserveService';

export default class DeleteReserveController {
  public async delete(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const deleteReserve = container.resolve(DeleteReserveService);

    await deleteReserve.execute({ _id });

    return response.status(HttpStatusCode.NO_CONTENT).send();
  }
}
