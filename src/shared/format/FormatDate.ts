import { format, parse } from 'date-fns';

export function parseDate(
  dateString: string,
  formatString: string = 'dd/MM/yyyy',
): Date {
  return parse(dateString, formatString, new Date());
}

export function formatDate(
  date: Date,
  formatString: string = 'dd/MM/yyyy',
): string {
  return format(date, formatString);
}
