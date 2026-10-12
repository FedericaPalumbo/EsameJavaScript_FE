import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* RegisterSuccessComponent è il contenuto del modal "utente registrato con successo".
Non viene messo nel template di nessuna pagina: lo apre RegisterComponent tramite NgbModal.
NgbActiveModal serve per chiuderlo: il close() fa risolvere la promise result di chi l'ha aperto. */
@Component({
    selector: 'app-register-success',
    templateUrl: './register-success.component.html',
    styleUrl: './register-success.component.css',
})
export class RegisterSuccessComponent {
    activeModal = inject(NgbActiveModal);
}