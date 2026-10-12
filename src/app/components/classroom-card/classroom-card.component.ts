import { Component, input, output } from '@angular/core';
import { Classroom } from '../../entities';

@Component({
    selector: 'app-classroom-card',
    imports: [],
    templateUrl: './classroom-card.component.html',
    styleUrl: './classroom-card.component.css',
})
export class ClassroomCardComponent {
    classroom = input.required<Classroom>();

    onDetail = output<void>();

    goToDetail() {
        this.onDetail.emit();
    }
}