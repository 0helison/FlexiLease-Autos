import { formatDate } from '@shared/format/FormatDate';
import { IUser } from '../domain/models/IUser';
import { differenceInYears } from 'date-fns';

export function formatUsers(users: IUser[]) {
  return users.map(user => formatUser(user));
}
export function formatUser(user: IUser) {
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    birthday: formatDate(user.birthday),
  };
}

export function isAtLeast18YearsOld(date: Date): boolean {
  return differenceInYears(Date.now(), date) >= 18;
}
