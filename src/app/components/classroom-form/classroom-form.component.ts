import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

export type ClassroomFormEvent = {
    name: string,
    students: string[]
}

/* ClassroomFormComponent è il contenuto del modal di creazione classe.
Non viene messo nel template di nessuna pagina: lo apre ClassroomAddPulsanteComponent tramite NgbModal.
NgbActiveModal rappresenta il modal "attualmente aperto": serve per chiuderlo (close) e restituire il risultato a chi l'ha aperto.
La lista degli studenti selezionabili la carica il form stesso (GET /api/users?type=student). */
@Component({
    selector: 'app-classroom-form',
    imports: [ReactiveFormsModule, AsyncPipe],
    templateUrl: './classroom-form.component.html',
    styleUrl: './classroom-form.component.css',
})
export class ClassroomFormComponent {
    protected fb = inject(FormBuilder);
    protected userSrv = inject(UserService);
    activeModal = inject(NgbActiveModal);

    students$ = this.userSrv.find('student');

    classroomForm = this.fb.group({
        name: new FormControl<string>('', {
            nonNullable: true,
            // pattern: non accetta un nome fatto solo di spazi
            validators: [Validators.required, Validators.pattern(/\S/)]
        }),
        // ids degli studenti selezionati: required fallisce se l'array è vuoto
        students: new FormControl<string[]>([], {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    isSelected(id: string) {
        return this.classroomForm.controls.students.value.includes(id);
    }

    toggleStudent(id: string) {
        const control = this.classroomForm.controls.students;
        const selected = control.value;
        control.setValue(
            selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
        );
        control.markAsTouched();
    }

    submit() {
        // il pulsante è disabilitato se il form non è valido, ma controllo anche qui
        if (this.classroomForm.invalid) return;

        const { name, students } = this.classroomForm.getRawValue();
        this.activeModal.close({ name: name.trim(), students } as ClassroomFormEvent);
    }
}