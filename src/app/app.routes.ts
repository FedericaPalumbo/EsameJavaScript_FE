import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ClassroomListComponent } from './pages/classroom-list/classroom-list.component';
import { authGuard } from './utils/auth.guard';
import { ClassroomCreateComponent } from './pages/classroom-create/classroom-create.component';
import { roleGuard } from './utils/role.guard';

export const routes: Routes = [
  {
    path: 'classrooms',
    component: ClassroomListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: '/classrooms',
    pathMatch: 'full'
  },
  {
    path: 'classrooms/new',
    component: ClassroomCreateComponent,
    canActivate: [authGuard, roleGuard] //Ordine dei guard: authGuard prima di roleGuard, quindi chi non è loggato va al login e solo dopo viene controllato il ruolo.
  },
];