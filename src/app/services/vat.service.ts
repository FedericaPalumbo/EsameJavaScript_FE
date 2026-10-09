import { computed, inject, Injectable, signal } from '@angular/core';
import { getVat } from '../cart-utils';
import { DEFAULT_COUNTRY_CODE } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class VatService {
  private defaultCountryCode = inject<string>(DEFAULT_COUNTRY_CODE);

  private countryCode = signal<string>(this.defaultCountryCode);

  vat = computed(() => {
    return getVat(this.countryCode());
  });

  setCountry(countryCode: string) {
    this.countryCode.set(countryCode);
  }
}
