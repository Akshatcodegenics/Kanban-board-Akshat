import React, { useState } from 'react';
import type { KanbanTask, KanbanBoardProps } from '@/types/kanban.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { Layers, Sparkles } from 'lucide-react';
import heroImage from '@/assets/kanban-hero.png';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 p-4 md:p-6 lg:p-8">
      {/* Hero Section with 3D Graphics */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
          <img 
            src={heroImage} 
            alt="Kanban Board Hero" 
            className="w-full h-32 md:h-40 object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 via-primary-800/30 to-transparent flex items-center">
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                    <Layers className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    Kanban Board
                  </h1>
                  <p className="text-white/90 text-sm mt-1 flex items-center gap-2 drop-shadow">
                    <Sparkles className="w-4 h-4" />
                    Drag and drop to organize your tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columns Container */}
      <div className="max-w-[1600px] mx-auto flex gap-6 overflow-x-auto kanban-scroll pb-6">
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
