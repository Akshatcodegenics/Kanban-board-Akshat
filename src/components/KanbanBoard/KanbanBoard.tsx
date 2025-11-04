import React, { useState } from 'react';
import type { KanbanTask, KanbanBoardProps } from '@/types/kanban.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumnForNewTask, setActiveColumnForNewTask] = useState<string | null>(null);

  const { dragState, handleDragStart, handleDragOver, handleDragEnd } = useDragAndDrop();

  const handleTaskEdit = (task: KanbanTask) => {
    setSelectedTask(task);
    setActiveColumnForNewTask(null);
    setIsModalOpen(true);
  };

  const handleTaskAdd = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    setSelectedTask(null);
    setActiveColumnForNewTask(columnId);
    setIsModalOpen(true);
  };

  const handleModalSave = (taskData: Partial<KanbanTask>) => {
    if (selectedTask) {
      // Update existing task
      onTaskUpdate(selectedTask.id, taskData);
    } else if (activeColumnForNewTask) {
      // Create new task
      const column = columns.find(col => col.id === activeColumnForNewTask);
      if (column) {
        onTaskCreate(activeColumnForNewTask, {
          title: taskData.title!,
          description: taskData.description,
          status: column.status,
          priority: taskData.priority,
          assignee: taskData.assignee,
          tags: taskData.tags,
          dueDate: taskData.dueDate,
        });
      }
    }
  };

  const handleDrop = (columnId: string, index: number) => {
    const { draggedId, draggedFromColumn } = dragState;
    
    if (!draggedId || !draggedFromColumn) return;

    onTaskMove(draggedId, draggedFromColumn, columnId, index);
    handleDragEnd();
  };

  return (
    <div className="h-full w-full bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag and drop tasks to organize your workflow
        </p>
      </div>

      {/* Columns Container */}
      <div className="flex gap-4 overflow-x-auto kanban-scroll pb-4">
        {columns.map(column => {
          const columnTasks = column.taskIds
            .map(taskId => tasks[taskId])
            .filter(Boolean);

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              draggedTaskId={dragState.draggedId}
              dropTargetIndex={
                dragState.dropTargetColumn === column.id ? dragState.dropTargetIndex : null
              }
              isDropTarget={dragState.dropTargetColumn === column.id}
              onTaskEdit={handleTaskEdit}
              onTaskAdd={handleTaskAdd}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          );
        })}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setActiveColumnForNewTask(null);
        }}
        task={selectedTask}
        onSave={handleModalSave}
        onDelete={selectedTask ? onTaskDelete : undefined}
      />
    </div>
  );
};
