import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICity, NewCity } from '../city.model';
import {ICountry} from "../../country/country.model";

export type PartialUpdateCity = Partial<ICity> & Pick<ICity, 'id'>;

export type EntityResponseType = HttpResponse<ICity>;
export type EntityArrayResponseType = HttpResponse<ICity[]>;

@Injectable({ providedIn: 'root' })
export class CityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cities');
  protected countryUrl = this.applicationConfigService.getEndpointFor('api/countries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(city: NewCity, file: File): Observable<EntityResponseType> {
    let formData = new FormData();
    formData.append("logo", file);
    // @ts-ignore
    formData.append('name', city.name);
    // @ts-ignore
    formData.append('country', city.country?.id)
    return this.http.post<ICity>(this.resourceUrl, formData, { observe: 'response' });
  }

  update(city: ICity): Observable<EntityResponseType> {
    city.logo = null;
    return this.http.put<ICity>(`${this.resourceUrl}/${this.getCityIdentifier(city)}`, city, {
      observe: 'response',
    });
  }

  updateWithFile(city: ICity, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("logo", file);
    // @ts-ignore
    formData.append('name', city.name);
    // @ts-ignore
    formData.append('country', city.country?.id)
    return this.http.patch(`${this.resourceUrl}/${city.id.toString()}`, formData, {
      observe: 'response',
    });
  }

  partialUpdate(bankAccount: PartialUpdateCity): Observable<EntityResponseType> {
    return this.http.patch<ICity>(`${this.resourceUrl}/${this.getCityIdentifier(bankAccount)}`, bankAccount, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryCountries(): Observable<HttpResponse<ICountry[]>> {
    return this.http.get<ICountry[]>(this.countryUrl, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCityIdentifier(city: Pick<ICity, 'id'>): number {
    return city.id;
  }

  getCountryIdentifier(country: Pick<ICountry, 'id'>): number {
    return country.id;
  }

  compareCity(o1: Pick<ICity, 'id'> | null, o2: Pick<ICity, 'id'> | null): boolean {
    return o1 && o2 ? this.getCityIdentifier(o1) === this.getCityIdentifier(o2) : o1 === o2;
  }

  compareCountry(o1: Pick<ICountry, 'id'> | null, o2: Pick<ICountry, 'id'> | null): boolean {
    return o1 && o2 ? this.getCountryIdentifier(o1) === this.getCountryIdentifier(o2) : o1 === o2;
  }

  addCityToCollectionIfMissing<Type extends Pick<ICity, 'id'>>(
    bankAccountCollection: Type[],
    ...bankAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bankAccounts: Type[] = bankAccountsToCheck.filter(isPresent);
    if (bankAccounts.length > 0) {
      const bankAccountCollectionIdentifiers = bankAccountCollection.map(
        bankAccountItem => this.getCityIdentifier(bankAccountItem)!
      );
      const bankAccountsToAdd = bankAccounts.filter(bankAccountItem => {
        const bankAccountIdentifier = this.getCityIdentifier(bankAccountItem);
        if (bankAccountCollectionIdentifiers.includes(bankAccountIdentifier)) {
          return false;
        }
        bankAccountCollectionIdentifiers.push(bankAccountIdentifier);
        return true;
      });
      return [...bankAccountsToAdd, ...bankAccountCollection];
    }
    return bankAccountCollection;
  }
}
