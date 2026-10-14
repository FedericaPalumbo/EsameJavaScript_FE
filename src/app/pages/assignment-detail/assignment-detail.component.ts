import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { catchError, combineLatest, EMPTY, map, switchMap } from 'rxjs';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentStudentListComponent } from '../../components/assignment-student-list/assignment-student-list.component';

/* AssignmentDetailComponent è la pagina che il docente apre premendo "studenti" su una attività,
all'indirizzo /classrooms/:classroomId/assignments/:id. Chiede al backend il dettaglio
(GET /api/classrooms/:classroomId/assignments/:id) e mostra chi ha completato (con la data) e chi no.

Gestione degli errori del backend:
- 404 (attività o classe inesistenti, classe di un altro docente, oppure l'utente è uno studente):
  si torna alla pagina delle attività della classe, che a sua volta rimanda alle classi se la classe non è valida
- qualunque altro errore: messaggio mostrato sopra */
@Component({
    selector: 'app-assignment-detail',
    imports: [
        AssignmentStudentListComponent,
        NgbProgressbar,
        AsyncPipe,
        DatePipe,
        RouterLink,
    ],
    templateUrl: './assignment-detail.component.html',
    styleUrl: './assignment-detail.component.css',
})
export class AssignmentDetailComponent {
    protected activatedRoute = inject(ActivatedRoute);
    protected router = inject(Router);
    protected assignmentSrv = inject(AssignmentService);

    errorMessage = signal<string | null>(null);

    classroomId$ = this.activatedRoute.params
        .pipe(
            map(params => params['classroomId'] as string)
        );

    assignmentId$ = this.activatedRoute.params
        .pipe(
            map(params => params['id'] as string)
        );

    assignment$ = combineLatest([
        this.classroomId$,
        this.assignmentId$
    ]).pipe(
        switchMap(([classroomId, id]) => this.assignmentSrv.getById(classroomId, id)
            .pipe(
                catchError(response => {
                    this.handleError(classroomId, response);
                    return EMPTY;
                })
            )
        )
    );

    private handleError(classroomId: string, response: HttpErrorResponse) {
        if (response.status === 404) {
            // replaceUrl: la pagina non valida non resta nella cronologia
            this.router.navigate(['/classrooms', classroomId], { replaceUrl: true });
        } else {
            // se manca il messaggio del BE (ad esempio server spento, status 0) uso un testo generico
            this.errorMessage.set(response.error?.message ?? 'Si è verificato un errore, riprova più tardi');
        }
    }
}
