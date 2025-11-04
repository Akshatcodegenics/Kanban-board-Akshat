export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  color: string;
  taskIds: string[];
  maxTasks?: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate: (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  draggedFromColumn: string | null;
  dropTargetColumn: string | null;
  dropTargetIndex: number | null;
}
