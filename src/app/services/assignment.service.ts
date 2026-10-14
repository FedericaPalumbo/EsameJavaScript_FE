import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Assignment, AssignmentDetail } from '../entities';

export type CreateAssignmentPayload = {
    title: string;
}

@Injectable({
    providedIn: 'root',
})
export class AssignmentService {
    private http = inject(HttpClient);

    find(classroomId: string) {
        return this.http.get<Assignment[]>(`/api/classrooms/${classroomId}/assignments`);
    }

    // GET disponibile solo per il docente che ha creato la classe: torna anche la lista degli studenti
    getById(classroomId: string, id: string) {
        return this.http.get<AssignmentDetail>(`/api/classrooms/${classroomId}/assignments/${id}`);
    }

    // POST disponibile solo per il docente che ha creato la classe
    create(classroomId: string, assignment: CreateAssignmentPayload) {
        return this.http.post<Assignment>(`/api/classrooms/${classroomId}/assignments`, assignment);
    }

    // PATCH senza body: l'utente che completa è già nel token JWT
    complete(classroomId: string, id: string) {
        return this.http.patch<Assignment>(`/api/classrooms/${classroomId}/assignments/${id}`, {});
    }

}