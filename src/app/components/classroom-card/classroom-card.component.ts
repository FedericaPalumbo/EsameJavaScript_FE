import { Component, computed, input, output } from '@angular/core';
import { Classroom } from '../../entities';

// colori della testata della card, a rotazione (corrispondono alle classi nel css)
const CARD_COLORS = ['coral', 'blue', 'yellow'];

@Component({
    selector: 'app-classroom-card',
    imports: [],
    templateUrl: './classroom-card.component.html',
    styleUrl: './classroom-card.component.css',
})
export class ClassroomCardComponent {
    classroom = input.required<Classroom>();
    // posizione della classe nella lista: decide colore e numero (01, 02, ...) della card
    index = input.required<number>();

    onDetail = output<void>();

    color = computed(() => CARD_COLORS[this.index() % CARD_COLORS.length]);
    number = computed(() => String(this.index() + 1).padStart(2, '0'));

    goToDetail() {
        this.onDetail.emit();
    }
}