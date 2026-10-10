import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ClassroomListComponent } from './pages/classroom-list/classroom-list.component';
import { authGuard } from './utils/auth.guard';

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
  }
];