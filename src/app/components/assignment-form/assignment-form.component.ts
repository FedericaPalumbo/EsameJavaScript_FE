import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

export type AssignmentFormEvent = {
    title: string
}

@Component({
    selector: 'app-assignment-form',
    imports: [ReactiveFormsModule],
    templateUrl: './assignment-form.component.html',
    styleUrl: './assignment-form.component.css',
})
export class AssignmentFormComponent {
    protected fb = inject(FormBuilder);

    onSubmit = output<AssignmentFormEvent>();

    assignmentForm = this.fb.group({
        title: new FormControl<string>('', {
            nonNullable: true,
            // pattern: non accetta un titolo fatto solo di spazi
            validators: [Validators.required, Validators.pattern(/\S/)]
        })
    });

    submit() {
        if (this.assignmentForm.valid) {
            const { title } = this.assignmentForm.getRawValue();
            this.onSubmit.emit({ title: title.trim() });
        }
    }
}