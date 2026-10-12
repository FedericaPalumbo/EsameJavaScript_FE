import { Component, inject, output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassroomFormComponent, ClassroomFormEvent } from '../classroom-form/classroom-form.component';

/* ClassroomAddPulsanteComponent è il pulsante "Nuova classe". Quando lo premi apre il modal con il form (NgbModal).
Non chiama il backend: quando il modal viene chiuso con "Crea classe" emette onAdd con i dati e la pagina si occupa del resto. */
@Component({
    selector: 'app-classroom-addpulsante',
    templateUrl: './classroom-addpulsante.component.html',
    styleUrl: './classroom-addpulsante.component.css',
})
export class ClassroomAddPulsanteComponent {
    private modalService = inject(NgbModal);

    onAdd = output<ClassroomFormEvent>();

    openModal() {
        const modalRef = this.modalService.open(ClassroomFormComponent);

        modalRef.result.then(
            (result: ClassroomFormEvent) => {
                this.onAdd.emit(result);
            },
            () => {
                // dismissed (X o click fuori dal modal), non fare nulla
            }
        );
    }
}