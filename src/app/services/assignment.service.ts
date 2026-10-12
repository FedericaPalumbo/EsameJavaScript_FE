import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Assignment } from '../entities';

@Injectable({
    providedIn: 'root',
})
export class AssignmentService {
    private http = inject(HttpClient);

    find(classroomId: string) {
        return this.http.get<Assignment[]>(`/api/classrooms/${classroomId}/assignments`);
    }

    // PATCH senza body: l'utente che completa è già nel token JWT
    complete(classroomId: string, id: string) {
        return this.http.patch<Assignment>(`/api/classrooms/${classroomId}/assignments/${id}`, {});
    }

}