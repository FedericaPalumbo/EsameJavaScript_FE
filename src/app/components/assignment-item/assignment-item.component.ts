import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { Assignment } from '../../entities';
import { IfRoleDirective } from '../../utils/if-role.directive';
//AssignmentItemComponent è la card che rappresenta una singola attività nella pagina della classe. È un componente “stupido” (di presentazione): non chiama il backend e non sa in che classe si trova, mostra i dati e avvisa chi lo usa quando succede qualcosa.

/*Cosa mostra:

il titolo e la data di creazione, in italiano
quanti studenti hanno completato l’attività sul totale (19/25), con la barra di avanzamento
il pulsante “Completa”, solo se l’utente è uno studente e non ha già completato l’attività

Cosa comunica:
quando lo studente preme “Completa”, il componente emette onComplete, ma non esegue lui la chiamata. Se la facesse lui, dovrebbe conoscere l’id della classe e gestire la risposta, e smetterebbe di essere riutilizzabile.*/
@Component({
    selector: 'app-assignment-item',
    imports: [
        DatePipe,
        NgbProgressbar,
        IfRoleDirective,
    ],
    templateUrl: './assignment-item.component.html',
    styleUrl: './assignment-item.component.css',
})
export class AssignmentItemComponent {
    assignment = input.required<Assignment>();

    onComplete = output<void>();
    onDetail = output<void>();

    complete() {
        this.onComplete.emit();
    }

    goToDetail() {
        this.onDetail.emit();
    }
}