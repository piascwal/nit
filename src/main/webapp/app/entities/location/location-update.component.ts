import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILocation, Location } from 'app/shared/model/location.model';
import { LocationService } from './location.service';
import { ICountry } from 'app/shared/model/country.model';
import { CountryService } from 'app/entities/country';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html'
})
export class LocationUpdateComponent implements OnInit {
  location: ILocation;
  isSaving: boolean;

  countries: ICountry[];

  editForm = this.fb.group({
    id: [],
    streetAddress: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    country: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected locationService: LocationService,
    protected countryService: CountryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);
      this.location = location;
    });
    this.countryService
      .query({ filter: 'location-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<ICountry[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICountry[]>) => response.body)
      )
      .subscribe(
        (res: ICountry[]) => {
          if (!this.location.country || !this.location.country.id) {
            this.countries = res;
          } else {
            this.countryService
              .find(this.location.country.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<ICountry>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<ICountry>) => subResponse.body)
              )
              .subscribe(
                (subRes: ICountry) => (this.countries = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(location: ILocation) {
    this.editForm.patchValue({
      id: location.id,
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      stateProvince: location.stateProvince,
      country: location.country
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocation {
    const entity = {
      ...new Location(),
      id: this.editForm.get(['id']).value,
      streetAddress: this.editForm.get(['streetAddress']).value,
      postalCode: this.editForm.get(['postalCode']).value,
      city: this.editForm.get(['city']).value,
      stateProvince: this.editForm.get(['stateProvince']).value,
      country: this.editForm.get(['country']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>) {
    result.subscribe((res: HttpResponse<ILocation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackCountryById(index: number, item: ICountry) {
    return item.id;
  }
}
