import { User } from './services/auth.service';

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