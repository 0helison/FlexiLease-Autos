import { isAfter } from 'date-fns';
import { IReserve } from '../domain/models/IReserve';
import { formatDate } from '@shared/format/FormatDate';

export function generateDateRange(start: Date, end: Date): Date[] {
  const dateArray: Date[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export function formatReserve(reserve: IReserve) {
  return {
    ...reserve,
    start_date: formatDate(reserve.start_date),
    end_date: formatDate(reserve.end_date),
  };
}

export function formatReserves(reserves: IReserve[]) {
  return reserves.map(reserve => formatReserve(reserve));
}

export function dateOrderValidation(startDate: Date, endDate: Date): boolean {
  return isAfter(startDate, endDate);
}
