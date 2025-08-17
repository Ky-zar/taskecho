export type TaskCategory = 'personal' | 'work' | 'shopping' | 'other';

export interface Task {
  id: string;
  text: string;
  isDone: boolean;
  category: TaskCategory;
  createdAt: string; // ISO string
}
