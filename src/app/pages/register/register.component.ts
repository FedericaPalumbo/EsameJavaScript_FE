import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../entities';
import { catchError, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {
    protected fb = inject(FormBuilder);
    protected authSrv = inject(AuthService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    registerForm = this.fb.group({
        firstName: ['', { validators: [Validators.required] }],
        lastName: ['', { validators: [Validators.required] }],
        picture: ['', { validators: [Validators.required] }],
        role: ['', { validators: [Validators.required] }],
        username: ['', { validators: [Validators.required] }],
        password: ['', { validators: [Validators.required] }]
    });

    errorMessage = signal<string | null>(null);

    ngOnInit() {
        this.registerForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.errorMessage.set(null))
    }

    register() {
        if (this.registerForm.valid) {
            const { firstName, lastName, picture, role, username, password } = this.registerForm.value;
            this.authSrv.register({
                firstName: firstName!,
                lastName: lastName!,
                picture: picture!,
                role: role as UserRole,
                username: username!,
                password: password!
            })
                .pipe(
                    catchError(response => {
                        const message = response.error.message;
                        this.errorMessage.set(message);
                        return throwError(() => response);
                    })
                )
                .subscribe(() => {
                    this.router.navigate(['/login']);
                });
        }
    }
}