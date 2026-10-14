import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, switchMap } from 'rxjs';
import { Classroom } from '../../entities';
import { ClassroomService } from '../../services/classroom.service';
import { ClassroomCardComponent } from '../../components/classroom-card/classroom-card.component';
import { ClassroomAddPulsanteComponent } from '../../components/classroom-addpulsante/classroom-addpulsante.component';
import { ClassroomFormEvent } from '../../components/classroom-form/classroom-form.component';
import { IfRoleDirective } from '../../utils/if-role.directive';

@Component({
  selector: 'app-classroom-list',
  imports: [
    ClassroomCardComponent,
    ClassroomAddPulsanteComponent,
    AsyncPipe,
    IfRoleDirective,
  ],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.css',
})
export class ClassroomListComponent {
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);

  errorMessage = signal<string | null>(null);

  // emette ogni volta che la lista va ricaricata (la prima emissione è il caricamento iniziale)
  protected reload$ = new BehaviorSubject<void>(undefined);

  classrooms$ = this.reload$.pipe(
    switchMap(() => this.classroomSrv.find())
  );

  // testo scritto nella barra di ricerca
  search = signal('');

  // classi il cui nome contiene il testo cercato. L'indice è quello nella lista completa:
  // così colore e numero delle card non cambiano mentre si digita
  visibleClassrooms(classrooms: Classroom[]) {
    const text = this.search().trim().toLowerCase();
    return classrooms
      .map((classroom, index) => ({ classroom, index }))
      .filter(item => item.classroom.name.toLowerCase().includes(text));
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/classrooms', id]);
  }

  // il docente crea la classe dal modal, poi la lista viene ricaricata
  create(classroom: ClassroomFormEvent) {
    this.errorMessage.set(null);
    this.classroomSrv.create(classroom)
      .pipe(
        catchError(response => {
          // se manca il messaggio del BE (ad esempio server spento, status 0) uso un testo generico
          this.errorMessage.set(response.error?.message ?? 'Si è verificato un errore, riprova più tardi');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }
}