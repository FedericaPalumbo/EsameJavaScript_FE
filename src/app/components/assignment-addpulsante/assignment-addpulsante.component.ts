import { Component, inject, output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignmentFormComponent, AssignmentFormEvent } from '../assignment-form/assignment-form.component';

/* AssignmentAddPulsanteComponent è il pulsante "Nuova attività". Quando lo premi apre il modal con il form (NgbModal).
Non chiama il backend: quando il modal viene chiuso con "Crea attività" emette onAdd con i dati e la pagina si occupa del resto. */
@Component({
    selector: 'app-assignment-addpulsante',
    templateUrl: './assignment-addpulsante.component.html',
    styleUrl: './assignment-addpulsante.component.css',
})
export class AssignmentAddPulsanteComponent {
    private modalService = inject(NgbModal);

    onAdd = output<AssignmentFormEvent>();

    openModal() {
        const modalRef = this.modalService.open(AssignmentFormComponent, { modalDialogClass: 'modal-brand modal-brand-narrow' });

        modalRef.result.then(
            (result: AssignmentFormEvent) => {
                this.onAdd.emit(result);
            },
            () => {
                // dismissed (X o click fuori dal modal), non fare nulla
            }
        );
    }
}