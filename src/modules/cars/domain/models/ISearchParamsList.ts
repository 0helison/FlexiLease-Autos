import { IAccessory } from './ICar';

export interface ISearchParamsList {
  limit: number;
  offset: number;
  model?: string;
  color?: string;
  year?: string;
  value_per_day?: number;
  number_of_passengers?: number;
  accessories?: Array<{ description: string }>;
}
