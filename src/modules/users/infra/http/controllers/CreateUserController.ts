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

    //const cepService = container.resolve(CepService);
    const createUser = container.resolve(CreateUserService);

    //const addressData = await cepService.getAddressData(cep);

    const userData = await createUser.execute({
      name,
      cpf,
      birthday: parsedDate,
      email,
      password,
      qualified,
      cep,
      complement: 'N/A', //addressData.complement,
      neighborhood: 'N/A', //addressData.neighborhood,
      locality: 'Sapé', //addressData.locality,
      uf: 'PB', //addressData.uf,
    });

    const user = formatUser(userData);

    return response.status(HttpStatusCode.CREATED).json(user);
  }
}
