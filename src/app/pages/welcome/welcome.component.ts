import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';

@Component({
    selector: 'app-welcome',
    imports: [RouterModule],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
    protected authSrv = inject(AuthService);
    private jwtSrv = inject(JwtService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    ngOnInit() {
        // Se l'utente è già autenticato non ha senso mostrare la scelta login/registrazione
        if (this.authSrv.isAuthenticated()) {
            this.router.navigate(['/classrooms']);
        } else if (this.jwtSrv.hasToken()) {
            // Refresh della pagina: aspetto che l'utente venga caricato
            this.authSrv.fetchUser()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(user => {
                    if (user) {
                        this.router.navigate(['/classrooms']);
                    }
                });
        }
    }
}