import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, catchError, combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentItemComponent } from '../../components/assignment-item/assignment-item.component';
/*AssignmentListComponent è la pagina della classe, quella che nel README si chiama “Pagina attività (o pagina della classe)”. Si apre quando premi “dettagli” su una classe nella lista, all’indirizzo /classrooms/:id.

Il suo compito è mostrare tutte le attività di quella classe. Prende l’id dall’URL, chiede al backend le attività (GET /api/classrooms/:id/assignments) e le stampa una per una. Per ogni attività usa assignment-item, che fa vedere titolo, data di creazione e quanti studenti l’hanno completata.

Quando uno studente preme “Completa” su un’attività, la pagina chiama il backend (PATCH) e poi ricarica la lista, così il contatore e il pulsante si aggiornano subito. */
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