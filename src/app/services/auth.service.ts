import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { UserRole } from '../entities';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
  fullName: string;
  role: UserRole;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  picture: string;
  role: UserRole;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);

  // richiesta di fetchUser() in corso: condivisa tra chi la chiama (constructor e guard)
  protected pendingFetch$: Observable<User | null> | null = null;

  protected _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  isAuthenticated = computed(() => {
    return !!this.currentUser();
  });

  isTeacher = computed(() => {
    return this.currentUser()?.role === 'teacher';
  });

  isStudent = computed(() => {
    return this.currentUser()?.role === 'student';
  });

  constructor() {
    this.fetchUser().subscribe();
  }

  fetchUser(): Observable<User | null> {
    if (!this.pendingFetch$) {
      this.pendingFetch$ = this.http.get<User>('/api/users/me')
        .pipe(
          catchError(() => {
            this.jwtSrv.removeToken();
            return of(null)
          }),
          tap(user => this._currentUser.set(user)),
          finalize(() => this.pendingFetch$ = null),
          shareReplay(1)
        );
    }
    return this.pendingFetch$;
  }

  login(username: string, password: string) {
    return this.http.post<{ user: User, token: string }>('/api/login', { username, password })
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        map(res => res.user),
        tap(user => this._currentUser.set(user))
      );
  }

  register(data: RegisterData) {
    return this.http.post<User>('/api/register', data);
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser.set(null);
  }

}