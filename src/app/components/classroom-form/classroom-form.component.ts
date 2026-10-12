import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../services/auth.service';

export type ClassroomFormEvent = {
    name: string,
    students: string[]
}

@Component({
    selector: 'app-classroom-form',
    imports: [ReactiveFormsModule],
    templateUrl: './classroom-form.component.html',
    styleUrl: './classroom-form.component.css',
})
export class ClassroomFormComponent {
    protected fb = inject(FormBuilder);

    students = input<User[]>([]);

    onSubmit = output<ClassroomFormEvent>();

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
        if (this.classroomForm.valid) {
            const { name, students } = this.classroomForm.getRawValue();
            this.onSubmit.emit({ name: name.trim(), students });
        }
    }
}