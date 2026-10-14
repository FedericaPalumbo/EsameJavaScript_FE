import { AbstractControl, ValidationErrors } from '@angular/forms';

// Stesse regole del RegisterDto del backend (auth.dto.ts), così l'utente le vede prima di inviare.
// Se il campo è vuoto non segnala nulla: ci pensa Validators.required.

// Restituisce { password: 'La password deve contenere almeno ...' } elencando solo ciò che manca
export function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    if (!value) {
        return null;
    }

    const missing: string[] = [];
    if (value.length < 8) missing.push('8 caratteri');
    if (!/[a-z]/.test(value)) missing.push('una lettera minuscola');
    if (!/[A-Z]/.test(value)) missing.push('una lettera maiuscola');
    if (!/\d/.test(value)) missing.push('un numero');
    if (!/[^A-Za-z0-9]/.test(value)) missing.push('un carattere speciale');

    if (missing.length === 0) {
        return null;
    }
    const last = missing.pop();
    const list = missing.length ? `${missing.join(', ')} e ${last}` : last;
    return { password: `La password deve contenere almeno ${list}.` };
}

// Accetta solo URL assoluti http/https (l'immagine profilo viene mostrata così com'è)
export function urlValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    if (!value) {
        return null;
    }

    try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:' ? null : { url: true };
    } catch {
        return { url: true };
    }
}