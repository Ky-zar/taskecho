"use client";

import { useMemo } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { TaskForm } from '@/components/task-form';
import { TaskItem } from '@/components/task-item';
import { ListTodo, CheckCircle2, History, Mic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Task } from '@/types';

export default function Home() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks]);

  const pendingTasks = useMemo(() => sortedTasks.filter(task => !task.isDone), [sortedTasks]);
  const doneTasks = useMemo(() => sortedTasks.filter(task => task.isDone), [sortedTasks]);

  const TaskList = ({ tasksToList }: { tasksToList: Task[] }) => {
    if (tasksToList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-lg mt-4">
          <Mic className="mx-auto h-12 w-12 text-primary/50" />
          <p className="font-medium mt-4">No tasks here!</p>
          <p className="text-sm">Add a new task or use your voice.</p>
        </div>
      );
    }
    return (
      <div className="space-y-3 mt-4">
        {tasksToList.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/30 text-foreground font-body">
      <div className="container mx-auto max-w-2xl py-8 sm:py-12 px-4">
        <header className="text-center mb-8 relative overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
            <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse-slow delay-2000"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">TaskEcho</h1>
            <p className="text-muted-foreground">a to-do list that listens, literally.</p>
        </header>

        <TaskForm addTask={addTask} />

        <div className="mt-8">
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-card/50">
                    <TabsTrigger value="pending">
                        <ListTodo className="mr-2 h-4 w-4" />
                        Pending ({pendingTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="done">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Done ({doneTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="hidden sm:inline-flex">
                        <History className="mr-2 h-4 w-4" />
                        All ({tasks.length})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <TaskList tasksToList={pendingTasks} />
                </TabsContent>
                <TabsContent value="done">
                    <TaskList tasksToList={doneTasks} />
                </TabsContent>
                <TabsContent value="all">
                    <TaskList tasksToList={sortedTasks} />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </main>
  );
}
