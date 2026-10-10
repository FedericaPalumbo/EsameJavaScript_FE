import { Component, input, output } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../services/auth.service';
//risponde alla richiesta di "una navbar con l’utente loggato o il pulsante di login"

@Component({
    selector: 'app-nav-user',
    imports: [
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        NgbDropdownItem,
    ],
    templateUrl: './nav-user.component.html',
    styleUrl: './nav-user.component.css',
})
export class NavUserComponent {
    user = input.required<User>();

    logoutEvent = output({ alias: 'logout' });

    logout() {
        this.logoutEvent.emit();
    }
}