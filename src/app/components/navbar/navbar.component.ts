import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
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

    // url corrente senza query string (es. /login?dest=/classrooms -> /login)
    private currentPath = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(event => event.urlAfterRedirects.split('?')[0])
        ),
        { initialValue: this.router.url.split('?')[0] }
    );

    // nelle pagine di login e registrazione il pulsante Login in navbar è superfluo
    showLoginBtn = computed(() => !['/login', '/register'].includes(this.currentPath()));


    logout() {
        this.authSrv.logout();
        this.router.navigate(['/']);
    }
}