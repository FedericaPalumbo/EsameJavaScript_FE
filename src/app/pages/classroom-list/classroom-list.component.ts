import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ClassroomService } from '../../services/classroom.service';
import { ClassroomCardComponent } from '../../components/classroom-card/classroom-card.component';
import { IfRoleDirective } from '../../utils/if-role.directive';

@Component({
  selector: 'app-classroom-list',
  imports: [
    ClassroomCardComponent,
    AsyncPipe,
    IfRoleDirective,
  ],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.css',
})
export class ClassroomListComponent {
  protected classroomSrv = inject(ClassroomService);
  protected router = inject(Router);

  classrooms$ = this.classroomSrv.find();

  navigateToDetail(id: string) {
    this.router.navigate(['/classrooms', id]);
  }

  navigateToCreate() {
    this.router.navigate(['/classrooms', 'new']);
  }
}