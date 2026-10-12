import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './auth.service';
import { UserRole } from '../entities';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);

    // il query param type è obbligatorio nello yaml (400 se manca o non è valido)
    find(type: UserRole) { //find(type: UserRole) fa GET /api/users?type=…, quindi find('student') chiama /api/users?type=student
        return this.http.get<User[]>('/api/users', { params: { type } });
    }

}