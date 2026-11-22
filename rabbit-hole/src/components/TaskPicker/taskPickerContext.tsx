
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TaskDeck from "./taskDeck";
import type { Task } from "@/src/lib/tasksApi";

type GeneratedTask = {
  id?: string;
  description?: string;
  task_name?: string;
  "task-name"?: string;
  estimated_complete_time?: string;
};

type PendingJourney = {
  goal: string;
  tasks: GeneratedTask[];
};

const TaskPickerContent = () => {
  const router = useRouter();

  const [journey, setJourney] = useState<{
    goal: string;
    tasks: Task[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJourney = sessionStorage.getItem("pendingJourney");

    if (!storedJourney) {
      router.replace("/");
      return;
    }

    try {
      const parsed: PendingJourney = JSON.parse(storedJourney);

      if (!parsed.goal || !Array.isArray(parsed.tasks)) {
        router.replace("/");
        return;
      }

      // Convert Gemini's task format into the TaskCard format.
      const tasks: Task[] = parsed.tasks.map((task, index) => {
        const taskName =
          task.task_name ??
          task["task-name"] ??
          task.description ??
          `Task ${index + 1}`;

        return {
          id: task.id ?? `task-${index}`,
          task_name: taskName,
          description: task.description ?? taskName,
          estimated_complete_time:
            task.estimated_complete_time ?? "",
        };
      });

      setJourney({
        goal: parsed.goal,
        tasks,
      });
    } catch (error) {
      console.error("Could not read pending journey:", error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading || !journey) {
    return null;
  }

  return (
    <TaskDeck
      key={journey.goal}
      goal={journey.goal}
      tasks={journey.tasks}
    />
  );
};

export default TaskPickerContent;
