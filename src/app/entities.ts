import { User } from './services/auth.service';

export const USER_ROLES = ['student', 'teacher'] as const;
export type UserRole = typeof USER_ROLES[number];
// Record<UserRole, string> obbliga ad aggiungere l'etichetta quando si aggiunge un ruolo
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  student: 'Studente',
  teacher: 'Docente',
};

export type Classroom = {
  id: string,
  name: string,
  studentsCount: number,
  createdBy: User
}

export type Assignment = {
  id: string,
  title: string,
  studentsCount: number,
  completedCount: number,
  completed?: boolean,
  createdAt: string,
  createdBy: User
}