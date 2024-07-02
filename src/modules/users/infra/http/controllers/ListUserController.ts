import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUserService from '@modules/users/services/ListUserService';
import { formatUsers } from '@modules/users/utils/formatUtils';
import { parseDateParams } from '@shared/format/FormatDate';

class ListUsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const limit = request.query.limit ? Number(request.query.limit) : 5;
    const offset = request.query.offset ? Number(request.query.offset) : 0;

    const name = request.query.name as string | undefined;
    const qualified = request.query.qualified as string | undefined;
    const cep = request.query.cep as string | undefined;
    const complement = request.query.complement as string | undefined;
    const neighborhood = request.query.neighborhood as string | undefined;
    const locality = request.query.locality as string | undefined;
    const uf = request.query.uf as string | undefined;

    const birthday = request.query.birthday
      ? parseDateParams(request.query.birthday as string)
      : undefined;

    const listUser = container.resolve(ListUserService);

    const usersData = await listUser.execute({
      limit,
      offset,
      name,
      birthday,
      qualified,
      cep,
      complement,
      neighborhood,
      locality,
      uf,
    });

    const formattedUser = formatUsers(usersData.users);

    const listUsers = {
      reserves: formattedUser,
      limit: usersData.limit,
      offset: usersData.offset,
      total: usersData.total,
      offsets: usersData.offsets,
    };

    return response.json(listUsers);
  }
}

export default ListUsersController;
