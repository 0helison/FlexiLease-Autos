import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ObjectId } from 'mongodb';
import { CepService } from '@modules/users/services/CepService';
import { parseDate } from '@shared/format/FormatDate';
import { formatUser } from '@modules/users/utils/formatUtils';

export default class UpdateUserController {
  public async update(request: Request, response: Response): Promise<Response> {
    const _id = new ObjectId(request.params.id);

    const { name, cpf, birthday, email, password, qualified, cep } =
      request.body;

    const parsedDate = parseDate(birthday);

    //const cepService = container.resolve(CepService);
    const createUser = container.resolve(UpdateUserService);

    //const addressData = await cepService.getAddressData(cep);

    const userData = await createUser.execute({
      _id,
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

    return response.status(HttpStatusCode.OK).json(user);
  }
}
