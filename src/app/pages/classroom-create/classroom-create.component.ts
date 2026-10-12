import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ClassroomFormComponent, ClassroomFormEvent } from '../../components/classroom-form/classroom-form.component';
import { ClassroomService } from '../../services/classroom.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-classroom-create',
    imports: [ClassroomFormComponent, AsyncPipe],
    templateUrl: './classroom-create.component.html',
    styleUrl: './classroom-create.component.css',
})
export class ClassroomCreateComponent {
    protected classroomSrv = inject(ClassroomService);
    protected userSrv = inject(UserService);
    private router = inject(Router);

    students$ = this.userSrv.find('student');

    errorMessage = signal<string | null>(null);

    create(classroom: ClassroomFormEvent) {
        this.errorMessage.set(null);
        this.classroomSrv.create(classroom)
            .pipe(
                catchError(response => {
                    const message = response.error.message;
                    this.errorMessage.set(message);
                    return throwError(() => response);
                })
            )
            .subscribe(() => {
                this.router.navigate(['/classrooms']);
            });
    }
}