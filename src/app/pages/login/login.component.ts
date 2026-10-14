import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { catchError, of, Subject, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    protected fb = inject(FormBuilder);
    protected authSrv = inject(AuthService);
    private jwtSrv = inject(JwtService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    loginForm = this.fb.group({
        role: ['student', { validators: [Validators.required] }],
        username: ['', { validators: [Validators.required] }],
        password: ['', { validators: [Validators.required] }]
    });

    errorMessage = signal<string | null>(null);

    ngOnInit() {
        // Se l'utente è già autenticato non ha senso mostrare il login
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

        this.loginForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.errorMessage.set(null))
    }

    login() {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            this.authSrv.login(username!, password!)
                .pipe(
                    catchError(response => {
                        const message = response.error.message;
                        this.errorMessage.set(message);
                        return throwError(() => response);
                    })
                )
                .subscribe(user => {
                    // l'account deve corrispondere alla scheda scelta (studente / docente)
                    if (user.role !== this.loginForm.value.role) {
                        this.authSrv.logout();
                        this.errorMessage.set(user.role === 'teacher'
                            ? 'Questo account è di un docente: seleziona "Sono un docente".'
                            : 'Questo account è di uno studente: seleziona "Sono uno studente".');
                        return;
                    }

                    const dest = this.activatedRoute.snapshot.queryParams['dest'] || '/classrooms';
                    this.router.navigate([dest]);
                });
        }
    }
}