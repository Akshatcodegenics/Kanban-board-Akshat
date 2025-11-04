import { format, isPast } from 'date-fns';
import type { Priority, TaskStatus } from '@/types/kanban.types';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return isPast(dueDate) && !isToday(dueDate);
};

/**
 * Checks if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Formats date for display
 */
export const formatDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  return format(date, 'MMM d');
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Gets priority color classes
 */
export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    low: 'border-l-4 border-priority-low bg-primary-50',
    medium: 'border-l-4 border-priority-medium bg-amber-50',
    high: 'border-l-4 border-priority-high bg-orange-50',
    urgent: 'border-l-4 border-priority-urgent bg-red-50',
  };
  return colors[priority];
};

/**
 * Gets priority badge classes
 */
export const getPriorityBadgeColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    low: 'bg-primary-100 text-primary-700 border-primary-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[priority];
};

/**
 * Gets status color
 */
export const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    'todo': 'bg-status-todo',
    'in-progress': 'bg-status-progress',
    'review': 'bg-status-review',
    'done': 'bg-status-done',
  };
  return colors[status];
};

/**
 * Reorders tasks within a column
 */
export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  
  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Generates unique ID
 */
export const generateId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
