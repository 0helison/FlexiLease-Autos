import bcryptjs from 'bcryptjs';
import { IHashProvider } from '../models/IHashedProvider';

class BcryptHashedProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return bcryptjs.hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return bcryptjs.compare(payload, hashed);
  }
}

export default BcryptHashedProvider;
