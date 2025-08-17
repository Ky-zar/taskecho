"use client";

import { useMemo } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { TaskForm } from '@/components/task-form';
import { TaskItem } from '@/components/task-item';
import { ListTodo, CheckCircle2, History } from 'lucide-react';
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
          <p className="font-medium">No tasks here!</p>
          <p className="text-sm">Enjoy your clear list.</p>
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
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto max-w-2xl py-8 sm:py-12 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">TaskEcho</h1>
          <p className="text-muted-foreground">Your simple and smart to-do list.</p>
        </header>

        <TaskForm addTask={addTask} />

        <div className="mt-8">
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card/50">
                    <TabsTrigger value="pending">
                        <ListTodo className="mr-2 h-4 w-4" />
                        Pending ({pendingTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="done">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Done ({doneTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
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
