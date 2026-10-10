import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ClassroomService } from '../../services/classroom.service';
import { AuthService } from '../../services/auth.service';
import { ClassroomCardComponent } from '../../components/classoom-card/classroom-card.component';

@Component({
  selector: 'app-classroom-list',
  imports: [
    ClassroomCardComponent,
    AsyncPipe,
  ],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.css',
})
export class ClassroomListComponent {
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);
  protected authSrv = inject(AuthService);

  isTeacher = this.authSrv.isTeacher;

  classrooms$ = this.classroomSrv.find();

  navigateToDetail(id: string) {
    this.router.navigate(['/classrooms', id]);
  }

  navigateToCreate() {
    this.router.navigate(['/classrooms', 'new']);
  }
}