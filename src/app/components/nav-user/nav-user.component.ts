import { Component, input, output } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../services/auth.service';

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