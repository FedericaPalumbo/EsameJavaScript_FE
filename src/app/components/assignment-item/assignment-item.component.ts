import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { Assignment } from '../../entities';
import { IfRoleDirective } from '../../utils/if-role.directive';

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

    complete() {
        this.onComplete.emit();
    }
}