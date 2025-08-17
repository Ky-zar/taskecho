"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Plus } from "lucide-react";
import type { TaskCategory } from '@/types';

interface TaskFormProps {
  addTask: (text: string, category: TaskCategory) => void;
}

export function TaskForm({ addTask }: TaskFormProps) {
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      addTask(taskText, category);
      setTaskText('');
    }
  };

  const handleVoiceInput = () => {
    setIsRecording((prev) => !prev);
    if (isRecording) {
      // Simulate stopping recording and adding a task.
      addTask("Example voice-recorded task", category);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex flex-grow gap-2">
        <Input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow"
          aria-label="New task input"
        />
        <Select value={category} onValueChange={(value: TaskCategory) => setCategory(value)}>
          <SelectTrigger className="w-[130px]" aria-label="Task category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-grow sm:flex-none">
          <Plus className="h-4 w-4" />
          <span className="sm:hidden lg:inline-block ml-2">Add Task</span>
        </Button>
        <Button type="button" variant={isRecording ? "destructive" : "outline"} size="icon" onClick={handleVoiceInput} aria-label={isRecording ? "Stop recording" : "Record voice task"}>
          <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </form>
  );
}
