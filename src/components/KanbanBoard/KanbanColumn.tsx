import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { KanbanColumn as KanbanColumnType, KanbanTask } from '@/types/kanban.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/primitives/Button';
import { getStatusColor } from '@/utils/task.utils';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  draggedTaskId: string | null;
  dropTargetIndex: number | null;
  isDropTarget: boolean;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskAdd: (columnId: string) => void;
  onDragStart: (taskId: string, columnId: string, element: HTMLElement) => void;
  onDragOver: (columnId: string, index: number) => void;
  onDragEnd: () => void;
  onDrop: (columnId: string, index: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  draggedTaskId,
  dropTargetIndex,
  isDropTarget,
  onTaskEdit,
  onTaskAdd,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}) => {
  const columnRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(column.id, index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    onDrop(column.id, index);
  };

  const isNearWIPLimit = column.maxTasks && tasks.length >= column.maxTasks * 0.8;
  const isAtWIPLimit = column.maxTasks && tasks.length >= column.maxTasks;

  return (
    <div
      ref={columnRef}
      className={cn(
        'flex flex-col w-80 shrink-0 bg-neutral-50 rounded-xl border border-border transition-colors duration-base',
        isDropTarget && 'drag-over'
      )}
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks${column.maxTasks ? `, WIP limit ${column.maxTasks}` : ''}.`}
    >
      {/* Column Header */}
      <div className="px-4 py-3 border-b border-border bg-card rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn('w-2 h-2 rounded-full', getStatusColor(column.status))}
              aria-hidden="true"
            />
            <h3 className="font-semibold text-sm text-foreground">
              {column.title}
            </h3>
            <span className="text-xs text-muted-foreground bg-neutral-100 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>

          {/* WIP Limit Indicator */}
          {column.maxTasks && (
            <div
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded',
                isAtWIPLimit && 'bg-red-100 text-red-700',
                isNearWIPLimit && !isAtWIPLimit && 'bg-amber-100 text-amber-700',
                !isNearWIPLimit && 'text-muted-foreground'
              )}
              title="Work In Progress limit"
            >
              {tasks.length}/{column.maxTasks}
            </div>
          )}
        </div>
      </div>

      {/* Tasks Container */}
      <div
        className="flex-1 p-3 space-y-2 overflow-y-auto kanban-scroll min-h-[200px] max-h-[calc(100vh-250px)]"
        onDragOver={(e) => handleDragOver(e, tasks.length)}
        onDrop={(e) => handleDrop(e, tasks.length)}
      >
        {tasks.length === 0 && !draggedTaskId && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
            No tasks yet
          </div>
        )}

        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            {/* Drop Indicator */}
            {isDropTarget && dropTargetIndex === index && draggedTaskId !== task.id && (
              <div className="drop-indicator" aria-hidden="true" />
            )}

            {/* Task Card */}
            <div
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <KanbanCard
                task={task}
                columnId={column.id}
                isDragging={draggedTaskId === task.id}
                onEdit={onTaskEdit}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            </div>
          </React.Fragment>
        ))}

        {/* Drop Indicator at end */}
        {isDropTarget && dropTargetIndex === tasks.length && (
          <div className="drop-indicator" aria-hidden="true" />
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t border-border bg-card rounded-b-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTaskAdd(column.id)}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          disabled={isAtWIPLimit}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
          Add task
        </Button>
      </div>
    </div>
  );
};
