import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { KanbanTask } from '@/types/kanban.types';
import {
  formatDate,
  isOverdue,
  getPriorityColor,
  getPriorityBadgeColor,
} from '@/utils/task.utils';
import { Avatar } from '@/components/primitives/Avatar';

export interface KanbanCardProps {
  task: KanbanTask;
  isDragging: boolean;
  columnId: string;
  onEdit: (task: KanbanTask) => void;
  onDragStart: (taskId: string, columnId: string, element: HTMLElement) => void;
  onDragEnd: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  isDragging,
  columnId,
  onEdit,
  onDragStart,
  onDragEnd,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    
    if (cardRef.current) {
      onDragStart(task.id, columnId, cardRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. ${task.priority ? `Priority: ${task.priority}.` : ''} ${task.status ? `Status: ${task.status}.` : ''} Press Enter to edit.`}
      aria-grabbed={isDragging}
      className={cn(
        'bg-card border border-border rounded-lg p-3 shadow-sm transition-all duration-base cursor-grab select-none group',
        'hover:shadow-md hover:border-neutral-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isDragging && 'dragging',
        task.priority && getPriorityColor(task.priority)
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm text-card-foreground line-clamp-2 flex-1">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded border shrink-0',
              getPriorityBadgeColor(task.priority)
            )}
          >
            {task.priority}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {/* Due Date */}
        {task.dueDate && (
          <div
            className={cn(
              'text-xs font-medium',
              isOverdue(task.dueDate) ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {formatDate(task.dueDate)}
          </div>
        )}

        {/* Assignee */}
        <div className="ml-auto">
          {task.assignee && <Avatar name={task.assignee} size="sm" />}
        </div>
      </div>
    </div>
  );
};
