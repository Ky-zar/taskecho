"use client";

import { useState, useEffect } from 'react';
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
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from "@/hooks/use-toast";
import { textToSpeech } from '@/ai/flows/tts-flow';

interface TaskFormProps {
  addTask: (text: string, category: TaskCategory, audioDataUri?: string) => void;
}

export function TaskForm({ addTask }: TaskFormProps) {
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const { toast } = useToast();

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    error: recognitionError,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setTaskText(transcript);
    }
  }, [transcript]);
  
  useEffect(() => {
    if (recognitionError) {
      toast({
        variant: 'destructive',
        title: 'Speech Recognition Error',
        description: recognitionError,
      });
    }
  }, [recognitionError, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      let audioDataUri: string | undefined = undefined;
      if (transcript) {
        setIsProcessingAudio(true);
        try {
          const { audioDataUri: generatedAudio } = await textToSpeech(taskText);
          audioDataUri = generatedAudio;
        } catch (error) {
          console.error("TTS generation failed", error);
          toast({
            variant: "destructive",
            title: "Audio Generation Failed",
            description: "Could not generate audio for the task.",
          });
        } finally {
          setIsProcessingAudio(false);
        }
      }

      addTask(taskText, category, audioDataUri);
      setTaskText('');
    }
  };

  const handleVoiceInput = () => {
    if (!hasRecognitionSupport) {
        toast({
            variant: "destructive",
            title: "Browser Not Supported",
            description: "Voice recognition is not supported in your browser.",
        });
        return;
    }

    if (isListening) {
      stopListening();
    } else {
      setTaskText('');
      startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex flex-grow gap-2">
        <Input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task or hold mic to speak..."
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
        <Button type="submit" className="flex-grow sm:flex-none" disabled={isProcessingAudio}>
          {isProcessingAudio ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span className="sm:hidden lg:inline-block ml-2">Add Task</span>
            </>
          )}
        </Button>
        <Button type="button" variant={isListening ? "destructive" : "outline"} size="icon" onClick={handleVoiceInput} aria-label={isListening ? "Stop recording" : "Record voice task"} disabled={isProcessingAudio}>
          <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </form>
  );
}
