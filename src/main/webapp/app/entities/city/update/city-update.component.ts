import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {concat, mergeAll, Observable} from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CityFormService, CityFormGroup } from './city-form.service';
import { ICity } from '../city.model';
import { CityService } from '../service/city.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import {ICountry} from "../../country/country.model";

@Component({
  selector: 'jhi-city-update',
  templateUrl: './city-update.component.html',
})
export class CityUpdateComponent implements OnInit {
  isSaving = false;
  city: ICity | null = null;

  countries: ICountry[] | null = [];

  logoFile : File = new File(new Array<Blob>(), "Mock.zip", { type: 'application/zip' });

  editForm: CityFormGroup = this.cityFormService.createCityFormGroup();

  constructor(
    protected cityService: CityService,
    protected cityFormService: CityFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean => this.cityService.compareCountry(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ city }) => {
      this.city = city;
      if (city) {
        this.updateForm(city);
      }
    });
    this.cityService.queryCountries().subscribe(value => this.countries = value.body);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const city = this.cityFormService.getCity(this.editForm);
    if (city.id !== null) {
      //this.subscribeToSaveResponse(this.cityService.update(city));
      this.subscribeToSaveResponse(this.cityService.updateWithFile(city, this.logoFile));
    } else {
      this.subscribeToSaveResponse(this.cityService.create(city, this.logoFile));
    }
  }

  protected subscribeToSaveLogo(result: Observable<HttpResponse<ICity>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICity>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(city: ICity): void {
    this.city = city;
    this.cityFormService.resetForm(this.editForm, city);
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];
    if (file) {
      this.logoFile = file;
    }
  }
}
