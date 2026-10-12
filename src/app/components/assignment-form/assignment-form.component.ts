import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export type AssignmentFormEvent = {
    title: string
}

/* AssignmentFormComponent è il contenuto del modal di creazione attività.
Non viene messo nel template di nessuna pagina: lo apre AssignmentAddPulsanteComponent tramite NgbModal.
NgbActiveModal rappresenta il modal "attualmente aperto": serve per chiuderlo (close) e restituire il risultato a chi l'ha aperto. */
@Component({
    selector: 'app-assignment-form',
    imports: [ReactiveFormsModule],
    templateUrl: './assignment-form.component.html',
    styleUrl: './assignment-form.component.css',
})
export class AssignmentFormComponent {
    protected fb = inject(FormBuilder);
    activeModal = inject(NgbActiveModal);

    assignmentForm = this.fb.group({
        title: new FormControl<string>('', {
            nonNullable: true,
            // pattern: non accetta un titolo fatto solo di spazi
            validators: [Validators.required, Validators.pattern(/\S/)]
        })
    });

    submit() {
        // il pulsante è disabilitato se il form non è valido, ma controllo anche qui
        if (this.assignmentForm.invalid) return;

        const { title } = this.assignmentForm.getRawValue();
        this.activeModal.close({ title: title.trim() } as AssignmentFormEvent);
    }
}