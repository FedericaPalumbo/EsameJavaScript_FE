import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AssignmentStudent } from '../../entities';

/* AssignmentStudentListComponent mostra, per una attività, gli studenti divisi in due colonne:
chi l'ha completata (con la data) e chi no. È un componente di presentazione: riceve la lista
dalla pagina e non chiama il backend. */
@Component({
    selector: 'app-assignment-student-list',
    imports: [DatePipe],
    templateUrl: './assignment-student-list.component.html',
    styleUrl: './assignment-student-list.component.css',
})
export class AssignmentStudentListComponent {
    students = input.required<AssignmentStudent[]>();

    completed = computed(() => this.students().filter(s => s.completed));

    pending = computed(() => this.students().filter(s => !s.completed));
}
