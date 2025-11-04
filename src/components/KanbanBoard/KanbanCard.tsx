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
import { Calendar, Tag, AlertCircle } from 'lucide-react';

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
        'bg-card border border-border rounded-xl p-4 shadow-md transition-all duration-base cursor-grab select-none group relative overflow-hidden',
        'hover:shadow-xl hover:border-primary-200 hover:-translate-y-1',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        isDragging && 'dragging',
        task.priority && getPriorityColor(task.priority)
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-semibold text-sm text-card-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
          {task.title}
        </h4>
        {task.priority && (
          <span
            className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1 shadow-sm',
              getPriorityBadgeColor(task.priority)
            )}
          >
            <AlertCircle className="w-3 h-3" />
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
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-200 flex items-center gap-1 font-medium"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-muted-foreground font-medium">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        {/* Due Date */}
        {task.dueDate && (
          <div
            className={cn(
              'text-xs font-medium flex items-center gap-1.5 px-2 py-1 rounded-full',
              isOverdue(task.dueDate) 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-neutral-100 text-muted-foreground'
            )}
          >
            <Calendar className="w-3 h-3" />
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
