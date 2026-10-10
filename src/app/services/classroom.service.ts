import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Classroom } from '../entities';

export type CreateClassroomPayload = {
    name: string;
    students: string[];
}

@Injectable({
    providedIn: 'root',
})
export class ClassroomService {
    private http = inject(HttpClient);

    find() {
        return this.http.get<Classroom[]>('/api/classrooms');
    }

    create(classroom: CreateClassroomPayload) {
        return this.http.post<Classroom>('/api/classrooms', classroom);
    }

}