import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../entities';
import { omitBy, isNil } from 'lodash';

export type ProductFilter = {
  name?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

type ProductQuery = {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  find(filters: ProductFilter = {}) {
    const q: ProductQuery = omitBy(filters, isNil);
    return this.http.get<Product[]>('/api/products', {params: q});
  }

  getById(id: string) {
    return this.http.get<Product>(`/api/products/${id}`);
  }

}
