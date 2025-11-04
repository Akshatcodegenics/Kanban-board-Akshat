import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { KanbanColumn as KanbanColumnType, KanbanTask } from '@/types/kanban.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/primitives/Button';
import { getStatusColor } from '@/utils/task.utils';
import { Plus, Circle } from 'lucide-react';

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
        'flex flex-col w-80 shrink-0 bg-gradient-to-br from-card to-neutral-50 rounded-2xl border-2 border-border shadow-lg transition-all duration-base',
        isDropTarget && 'drag-over ring-2 ring-primary-400 ring-offset-2'
      )}
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks${column.maxTasks ? `, WIP limit ${column.maxTasks}` : ''}.`}
    >
      {/* Column Header */}
      <div className="px-5 py-4 border-b-2 border-border bg-gradient-to-r from-card to-neutral-50/50 rounded-t-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn('w-3 h-3 rounded-full shadow-sm', getStatusColor(column.status))}
              aria-hidden="true"
            />
            <h3 className="font-bold text-base text-foreground">
              {column.title}
            </h3>
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 shadow-sm">
              {tasks.length}
            </span>
          </div>

          {/* WIP Limit Indicator */}
          {column.maxTasks && (
            <div
              className={cn(
                'text-xs font-bold px-3 py-1 rounded-full shadow-sm border',
                isAtWIPLimit && 'bg-red-100 text-red-700 border-red-300',
                isNearWIPLimit && !isAtWIPLimit && 'bg-amber-100 text-amber-700 border-amber-300',
                !isNearWIPLimit && 'bg-neutral-100 text-muted-foreground border-neutral-300'
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
        className="flex-1 p-4 space-y-3 overflow-y-auto kanban-scroll min-h-[200px] max-h-[calc(100vh-250px)]"
        onDragOver={(e) => handleDragOver(e, tasks.length)}
        onDrop={(e) => handleDrop(e, tasks.length)}
      >
        {tasks.length === 0 && !draggedTaskId && (
          <div className="flex flex-col items-center justify-center h-40 text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl bg-neutral-50/50">
            <Circle className="w-8 h-8 mb-2 opacity-40" />
            <span className="font-medium">No tasks yet</span>
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
      <div className="p-4 border-t-2 border-border bg-gradient-to-r from-card to-neutral-50/50 rounded-b-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTaskAdd(column.id)}
          className="w-full justify-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-semibold gap-2 border-2 border-dashed border-primary-200 hover:border-primary-400 rounded-xl transition-all"
          disabled={isAtWIPLimit}
        >
          <Plus className="w-4 h-4" />
          Add task
        </Button>
      </div>
    </div>
  );
};
