import { HttpClient } from '@angular/common/http';
import { CartItem } from '../entities';
import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartSourceService {
  private http = inject(HttpClient);
  private authSrv = inject(AuthService);

  private internal = signal<CartItem[]>([]);
  cart = this.internal.asReadonly();

  constructor() {
    effect(() => {
      const isAuthenticated = this.authSrv.isAuthenticated();
      if (isAuthenticated) {
        this.fetch();
      } else {
        this.internal.set([]);
      }
    })
  }

  fetch() {
    this.http.get<CartItem[]>('/api/cart-items').subscribe(items => {
      this.internal.set(items);
    })
  }

  setQuantity(id: string, newQuantity: number): void {
    if (newQuantity < 0) {
      newQuantity = 0;
    }

    this.http.put<CartItem>(`/api/cart-items/${id}`, { quantity: newQuantity })
      .subscribe(updated => {
        const index = this.internal().findIndex(item => item.id === id);
        if (index === -1) {
          throw new Error(`Missing item with id ${id}`);
        }
        const clone = structuredClone(this.internal());
        clone[index] = updated;
        this.internal.set(clone);
      });
  }

  removeItem(id: string): void {
    this.http.delete(`/api/cart-items/${id}`).subscribe(() => {
      const index = this.internal().findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Missing item with id ${id}`);
      }
      const clone = structuredClone(this.internal());
      clone.splice(index, 1);
      this.internal.set(clone);
    });
  }

  add(id: string, quantity: number) {
    const payload = {
      productId: id,
      quantity
    };

    this.http.post<CartItem>('/api/cart-items', payload).subscribe(newItem => {
      const index = this.internal().findIndex(item => item.product.id === id);
      const clone = structuredClone(this.internal());
      if (index === -1) {
        clone.push(newItem);
      } else {
        clone[index] = newItem;
      }

      this.internal.set(clone);
    })
  }
}
