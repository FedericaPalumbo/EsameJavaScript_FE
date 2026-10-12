import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, catchError, combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentItemComponent } from '../../components/assignment-item/assignment-item.component';

@Component({
    selector: 'app-assignment-list',
    imports: [
        AssignmentItemComponent,
        AsyncPipe,
        RouterLink,
    ],
    templateUrl: './assignment-list.component.html',
    styleUrl: './assignment-list.component.css',
})
export class AssignmentListComponent {
    protected activatedRoute = inject(ActivatedRoute);
    protected assignmentSrv = inject(AssignmentService);

    errorMessage = signal<string | null>(null);

    classroomId$ = this.activatedRoute.params
        .pipe(
            map(params => params['id'] as string)
        );

    // emette ogni volta che la lista va ricaricata (la prima emissione è il caricamento iniziale)
    protected reload$ = new BehaviorSubject<void>(undefined);

    assignments$ = combineLatest([
        this.classroomId$,
        this.reload$
    ]).pipe(
        tap(() => this.errorMessage.set(null)),
        switchMap(([classroomId]) => this.assignmentSrv.find(classroomId)
            .pipe(
                catchError(response => {
                    this.errorMessage.set(response.error.message);
                    return of([]);
                })
            )
        )
    );

    complete(id: string) {
        this.classroomId$
            .pipe(
                take(1),
                switchMap(classroomId => this.assignmentSrv.complete(classroomId, id))
            )
            .subscribe(() => {
                this.reload$.next();
            });
    }
}