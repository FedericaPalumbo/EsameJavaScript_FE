import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ClassroomListComponent } from './pages/classroom-list/classroom-list.component';
import { authGuard } from './utils/auth.guard';
import { AssignmentListComponent } from './pages/assignment-list/assignment-list.component';

export const routes: Routes = [
  {
    path: 'classrooms/:id',
    component: AssignmentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'classrooms',
    component: ClassroomListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent
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
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/welcome'
  }
];