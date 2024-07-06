import { IHashProvider } from '../models/IHashedProvider';

class HashProviderInMemory implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default HashProviderInMemory;
