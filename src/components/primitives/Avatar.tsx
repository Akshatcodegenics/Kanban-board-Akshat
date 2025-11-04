import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils/task.utils';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className }) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  // Generate a consistent color based on name
  const getColorFromName = (name: string): string => {
    const colors = [
      'bg-primary-500',
      'bg-status-progress',
      'bg-status-review',
      'bg-emerald-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium shrink-0',
        getColorFromName(name),
        sizes[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
