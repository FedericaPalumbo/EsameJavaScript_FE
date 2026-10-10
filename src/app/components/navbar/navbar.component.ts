import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { NavUserComponent } from "../nav-user/nav-user.component";
import { AuthService } from '../../services/auth.service';
import { IfAuthenticatedDirective } from "../../utils/if-authenticated.directive";

@Component({
    selector: 'app-navbar',
    imports: [
        RouterLink,
        RouterLinkActive,
        NavUserComponent,
        RouterModule,
        IfAuthenticatedDirective],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    private authSrv = inject(AuthService);
    private router = inject(Router);

    currentUser = this.authSrv.currentUser;


    logout() {
        this.authSrv.logout();
        this.router.navigate(['/']);
    }
}