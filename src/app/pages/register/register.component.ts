import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../entities';
import { catchError, switchMap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterSuccessComponent } from '../../components/register-success/register-success.component';
import { passwordValidator, urlValidator } from '../../utils/validators';

// messaggio mostrato sotto il campo quando è vuoto
const REQUIRED_MESSAGES: Record<string, string> = {
    firstName: 'Inserisci il tuo nome.',
    lastName: 'Inserisci il tuo cognome.',
    picture: 'Inserisci l\'URL della tua immagine profilo.',
    username: 'Inserisci la tua email.',
    password: 'Inserisci una password.'
};

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
    private modalService = inject(NgbModal);

    registerForm = this.fb.group({
        firstName: ['', { validators: [Validators.required] }],
        lastName: ['', { validators: [Validators.required] }],
        picture: ['', { validators: [Validators.required, urlValidator] }],
        role: ['student', { validators: [Validators.required] }],
        // il pattern richiede anche il punto dopo la @ (Validators.email accetterebbe "mario@scuola"), come @IsEmail del backend
        username: ['', { validators: [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)] }],
        password: ['', { validators: [Validators.required, passwordValidator] }]
    });

    errorMessage = signal<string | null>(null);
    // errori di un campo specifico restituiti dal backend (es. { username: 'Esiste già un account...' })
    serverErrors = signal<Record<string, string>>({});

    ngOnInit() {
        this.registerForm.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.errorMessage.set(null);
                this.serverErrors.set({});
            })
    }

    // messaggio di errore da mostrare sotto il campo (null = nessun errore).
    // Gli errori di validazione compaiono solo dopo che l'utente ha toccato il campo o ha premuto "Crea account"
    fieldError(name: string): string | null {
        const serverError = this.serverErrors()[name];
        if (serverError) {
            return serverError;
        }

        const control = this.registerForm.get(name)!;
        if (!control.touched || !control.errors) {
            return null;
        }
        if (control.errors['required']) {
            return REQUIRED_MESSAGES[name];
        }
        if (control.errors['password']) {
            return control.errors['password'];
        }
        return name === 'picture'
            ? 'Inserisci un URL valido che inizi con http:// o https://'
            : 'Inserisci un\'email valida (es. nome@scuola.it).';
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
                    // registrazione riuscita: faccio subito il login con le stesse credenziali,
                    // così l'utente entra senza passare dalla pagina di login
                    switchMap(() => this.authSrv.login(username!, password!)),
                    catchError(response => {
                        // 'UserExists' è l'errore previsto dal backend (400) quando l'email è già registrata
                        if (response.error?.error === 'UserExists') {
                            this.serverErrors.set({ username: 'Esiste già un account con questa email.' });
                        } else {
                            this.errorMessage.set(response.error?.message ?? 'Impossibile contattare il server, riprova più tardi.');
                        }
                        return throwError(() => response);
                    })
                )
                .subscribe(() => this.openSuccessModal());
        } else {
            // mostra subito gli errori di tutti i campi non validi
            this.registerForm.markAllAsTouched();
        }
    }

    // mostra il modal di successo e, alla chiusura ("Continua" o click fuori), porta l'utente alla lista classi
    private openSuccessModal() {
        const modalRef = this.modalService.open(RegisterSuccessComponent, { centered: true });

        modalRef.result.then(
            () => this.router.navigate(['/classrooms']),
            () => this.router.navigate(['/classrooms'])
        );
    }
}