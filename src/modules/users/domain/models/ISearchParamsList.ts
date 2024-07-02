export interface ISearchParamsList {
  offset: number;
  limit: number;
  name?: string;
  birthday?: Date;
  qualified?: string;
  cep?: string;
  complement?: string;
  neighborhood?: string;
  locality?: string;
  uf?: string;
}
