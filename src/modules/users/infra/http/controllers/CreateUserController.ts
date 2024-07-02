import { CepService } from '@modules/users/services/CepService';
import CreateUserService from '@modules/users/services/CreateUserService';
import { formatUser } from '@modules/users/utils/formatUtils';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { parseDate } from '@shared/format/FormatDate';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CreateUserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, cpf, birthday, email, password, qualified, cep } =
      request.body;

    const parsedDate = parseDate(birthday);

    const addressData = await CepService(cep);

    const createUser = container.resolve(CreateUserService);

    const userData = await createUser.execute({
      name,
      cpf,
      birthday: parsedDate,
      email,
      password,
      qualified,
      cep,
      complement: addressData.complement,
      neighborhood: addressData.neighborhood,
      locality: addressData.locality,
      uf: addressData.uf,
    });

    const user = formatUser(userData);

    return response.status(HttpStatusCode.CREATED).json(user);
  }
}
