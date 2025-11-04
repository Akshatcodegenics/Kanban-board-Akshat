import { useState, useCallback, useRef } from 'react';
import type { DragState } from '@/types/kanban.types';

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedFromColumn: null,
    dropTargetColumn: null,
    dropTargetIndex: null,
  });

  const draggedElement = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback((taskId: string, columnId: string, element: HTMLElement) => {
    draggedElement.current = element;
    setDragState({
      isDragging: true,
      draggedId: taskId,
      draggedFromColumn: columnId,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  const handleDragOver = useCallback((columnId: string, index: number) => {
    setDragState(prev => ({
      ...prev,
      dropTargetColumn: columnId,
      dropTargetIndex: index,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedElement.current = null;
    setDragState({
      isDragging: false,
      draggedId: null,
      draggedFromColumn: null,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  const resetDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      draggedFromColumn: null,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    resetDrag,
  };
};
