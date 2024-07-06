import { container } from 'tsyringe';
import { IHashProvider } from './models/IHashedProvider';
import BcryptHashedProvider from './implementation/BcryptHashedProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  BcryptHashedProvider,
);
