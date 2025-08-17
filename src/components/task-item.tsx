"use client";

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Briefcase, User, ShoppingCart, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskCategory } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<TaskCategory, React.ReactNode> = {
  personal: <User className="h-3 w-3" />,
  work: <Briefcase className="h-3 w-3" />,
  shopping: <ShoppingCart className="h-3 w-3" />,
  other: <MoreHorizontal className="h-3 w-3" />,
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Wait for animation to finish before calling the actual delete function from the parent
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  };
  
  return (
    <div
      role="listitem"
      className={cn(
        "flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm transition-all duration-300",
        task.isDone && "opacity-50",
        isDeleting ? 'animate-out fade-out zoom-out-95' : 'animate-in fade-in zoom-in-95'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.isDone}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`Mark task ${task.isDone ? 'as not done' : 'as done'}`}
        className="h-5 w-5 rounded-[4px]"
      />
      <div className="flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "font-medium transition-all cursor-pointer",
            task.isDone && "line-through text-muted-foreground"
          )}
        >
          {task.text}
        </label>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="secondary" className="capitalize flex items-center gap-1.5 py-0.5 px-2">
            {categoryIcons[task.category]}
            {task.category}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleDelete} aria-label="Delete task">
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
      </Button>
    </div>
  );
}
