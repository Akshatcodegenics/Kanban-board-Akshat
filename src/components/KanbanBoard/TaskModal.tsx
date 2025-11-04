import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import type { KanbanTask, Priority, TaskStatus } from '@/types/kanban.types';
import { cn } from '@/lib/utils';

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTask | null;
  columnId?: string;
  onSave: (task: Partial<KanbanTask>) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assignee: '',
    tags: [],
    dueDate: undefined,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status,
        assignee: task.assignee || '',
        tags: task.tags || [],
        dueDate: task.dueDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignee: '',
        tags: [],
        dueDate: undefined,
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    
    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleDelete = () => {
    if (task && onDelete && confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create Task'}
      description={task ? 'Update task details below' : 'Add a new task to your board'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-foreground mb-1">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
            placeholder="Task title"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-foreground mb-1">
            Description
          </label>
          <textarea
            id="task-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground resize-none"
            placeholder="Task description"
            rows={3}
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium text-foreground mb-1">
              Priority
            </label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-status" className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <select
              id="task-status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-assignee" className="block text-sm font-medium text-foreground mb-1">
              Assignee
            </label>
            <input
              id="task-assignee"
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="task-duedate" className="block text-sm font-medium text-foreground mb-1">
              Due Date
            </label>
            <input
              id="task-duedate"
              type="date"
              value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dueDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="task-tags" className="block text-sm font-medium text-foreground mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="task-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
              placeholder="Add tag"
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded border border-neutral-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                    aria-label={`Remove ${tag} tag`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <div>
            {task && onDelete && (
              <Button type="button" variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {task ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
