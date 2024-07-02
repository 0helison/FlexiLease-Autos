import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUserService from '@modules/users/services/ListUserService';
import { formatUsers } from '@modules/users/utils/formatUtils';

class ListUsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const limit = request.query.limit ? Number(request.query.limit) : 5;
    const offset = request.query.offset ? Number(request.query.offset) : 0;

    const listUser = container.resolve(ListUserService);

    const usersData = await listUser.execute({ limit, offset });

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
