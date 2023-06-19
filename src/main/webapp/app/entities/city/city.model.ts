import {ICountry} from "../country/country.model";
import {IUser} from "../user/user.model";

export interface ICity {
  id: number;
  name?: string | null;
  country?: Pick<ICountry, 'id' | 'name'> | null;
  logo?: string | null;
}

export type NewCity = Omit<ICity, 'id'> & { id: null };
