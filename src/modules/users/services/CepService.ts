import { CEP_INVALID } from '@shared/consts/ErrorMessagesConsts';
import { BusinessError } from '@shared/errors/BusinessError';
import axios from 'axios';
import { IAddressData } from '../domain/models/IAdressData';

export class CepService {
  public async getAddressData(cep: string): Promise<IAddressData> {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

    if (response.data.erro) {
      throw new BusinessError(CEP_INVALID);
    }

    const addressData: IAddressData = {
      complement:
        response.data.complemento !== '' ? response.data.complemento : 'N/A',
      neighborhood: response.data.bairro !== '' ? response.data.bairro : 'N/A',
      locality:
        response.data.localidade !== '' ? response.data.localidade : 'N/A',
      uf: response.data.uf !== '' ? response.data.uf : 'N/A',
    };

    return addressData;
  }
}
