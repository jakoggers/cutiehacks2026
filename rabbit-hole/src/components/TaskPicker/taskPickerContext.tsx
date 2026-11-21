
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import TaskDeck from "./taskDeck";

const cleanGoal = (raw: string | null): string => {
  return (raw ?? "").trim().slice(0, 240);
};

const TaskPickerContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goal = cleanGoal(searchParams.get("goal"));

  // Redirect home if no goal was provided
  useEffect(() => {
    if (!goal) {
      router.replace("/");
    }
  }, [goal, router]);

  if (!goal) {
    return null;
  }

  return <TaskDeck key={goal} goal={goal} />;
};

export default TaskPickerContent;
