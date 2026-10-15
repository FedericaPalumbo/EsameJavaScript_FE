import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Assignment, AssignmentStudent } from '../../entities';
import { IfRoleDirective } from '../../utils/if-role.directive';
import { AssignmentStudentListComponent } from '../assignment-student-list/assignment-student-list.component';
//AssignmentItemComponent è la card che rappresenta una singola attività nella pagina della classe. È un componente “stupido” (di presentazione): non chiama il backend e non sa in che classe si trova, mostra i dati e avvisa chi lo usa quando succede qualcosa.

/*Cosa mostra:

il titolo e la data di creazione, in italiano
quanti studenti hanno completato l’attività sul totale (19/25), con l’anello della percentuale
il pulsante “Completa”, solo se l’utente è uno studente e non ha già completato l’attività (altrimenti il badge “Completata”)
per il docente, la freccia che apre la card e mostra chi ha completato (AssignmentStudentListComponent)

Cosa comunica:
quando lo studente preme “Completa”, il componente emette onComplete, ma non esegue lui la chiamata. Se la facesse lui, dovrebbe conoscere l’id della classe e gestire la risposta, e smetterebbe di essere riutilizzabile.*/
@Component({
    selector: 'app-assignment-item',
    imports: [
        DatePipe,
        IfRoleDirective,
        AssignmentStudentListComponent,
    ],
    templateUrl: './assignment-item.component.html',
    styleUrl: './assignment-item.component.css',
})
export class AssignmentItemComponent {
    assignment = input.required<Assignment>();
    // docente: la card è aperta e mostra gli studenti. Lo decide la pagina, così ne resta aperta una sola
    open = input(false);
    // studenti dell'attività aperta (null finché il backend non ha risposto)
    students = input<AssignmentStudent[] | null>(null);

    onComplete = output<void>();
    onDetail = output<void>();

    // percentuale di completamento per l'anello
    percent = computed(() => {
        const { completedCount, studentsCount } = this.assignment();
        return studentsCount ? Math.round(completedCount / studentsCount * 100) : 0;
    });

    complete() {
        this.onComplete.emit();
    }

    goToDetail() {
        this.onDetail.emit();
    }
}