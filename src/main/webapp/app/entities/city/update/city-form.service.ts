import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICity, NewCity } from '../city.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICity for edit and NewCityFormGroupInput for create.
 */
type CityFormGroupInput = ICity | PartialWithRequiredKeyOf<NewCity>;

type CityFormDefaults = Pick<NewCity, 'id'>;

type CityFormGroupContent = {
  id: FormControl<ICity['id'] | NewCity['id']>;
  name: FormControl<ICity['name']>;
  logo: FormControl<ICity['logo']>;
  country: FormControl<ICity['country']>;
};

export type CityFormGroup = FormGroup<CityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CityFormService {
  createCityFormGroup(city: CityFormGroupInput = { id: null }): CityFormGroup {
    const cityRawValue = {
      ...this.getFormDefaults(),
      ...city,
    };
    return new FormGroup<CityFormGroupContent>({
      id: new FormControl(
        { value: cityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(cityRawValue.name, {
        validators: [Validators.required],
      }),
      country: new FormControl(cityRawValue.country),
      logo: new FormControl(cityRawValue.logo),
    });
  }

  getCity(form: CityFormGroup): ICity | NewCity {
    return form.getRawValue() as ICity | NewCity;
  }

  resetForm(form: CityFormGroup, bankAccount: CityFormGroupInput): void {
    const cityRawValue = { ...this.getFormDefaults(), ...bankAccount };
    form.reset(
      {
        ...cityRawValue,
        id: { value: cityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CityFormDefaults {
    return {
      id: null,
    };
  }
}
