import { useState, useCallback } from 'react';
import type { KanbanColumn, KanbanTask, TaskStatus } from '@/types/kanban.types';
import { reorderTasks, moveTaskBetweenColumns, generateId } from '@/utils/task.utils';

export const useKanbanBoard = (initialColumns: KanbanColumn[], initialTasks: Record<string, KanbanTask>) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const handleTaskMove = useCallback((
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number
  ) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const fromColumn = newColumns.find(col => col.id === fromColumnId);
      const toColumn = newColumns.find(col => col.id === toColumnId);

      if (!fromColumn || !toColumn) return prevColumns;

      const fromIndex = fromColumn.taskIds.indexOf(taskId);
      if (fromIndex === -1) return prevColumns;

      // Same column reorder
      if (fromColumnId === toColumnId) {
        fromColumn.taskIds = reorderTasks(fromColumn.taskIds, fromIndex, newIndex);
      } else {
        // Move between columns
        const result = moveTaskBetweenColumns(
          fromColumn.taskIds,
          toColumn.taskIds,
          fromIndex,
          newIndex
        );
        fromColumn.taskIds = result.source;
        toColumn.taskIds = result.destination;

        // Update task status
        setTasks(prevTasks => ({
          ...prevTasks,
          [taskId]: {
            ...prevTasks[taskId],
            status: toColumn.status,
          },
        }));
      }

      return newColumns;
    });
  }, []);

  const handleTaskCreate = useCallback((columnId: string, taskData: Omit<KanbanTask, 'id' | 'createdAt'>) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
    };

    setTasks(prev => ({
      ...prev,
      [newTask.id]: newTask,
    }));

    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? { ...col, taskIds: [...col.taskIds, newTask.id] }
          : col
      )
    );
  }, []);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...updates,
      },
    }));

    // If status changed, move to appropriate column
    if (updates.status) {
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const currentColumn = newColumns.find(col => col.taskIds.includes(taskId));
        const targetColumn = newColumns.find(col => col.status === updates.status);

        if (currentColumn && targetColumn && currentColumn.id !== targetColumn.id) {
          currentColumn.taskIds = currentColumn.taskIds.filter(id => id !== taskId);
          targetColumn.taskIds.push(taskId);
        }

        return newColumns;
      });
    }
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    setColumns(prevColumns =>
      prevColumns.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );
  }, []);

  return {
    columns,
    tasks,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  };
};
