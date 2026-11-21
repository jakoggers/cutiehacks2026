
import type { Profile } from "./journey-model";

export const mockProfile: Profile = {
  id: "preview-user",

  tasks: [
    {
      id: "task-1",
      description: "Go for a 20-minute walk",
      rank: 1,
    },
    {
      id: "task-2",
      description: "Read 10 pages of a book",
      rank: 2,
    },
    {
      id: "task-3",
      description: "Finish a difficult programming assignment",
      rank: 3,
    },
    {
      id: "task-4",
      description: "Clean and organize your desk",
      rank: 1,
    },
    {
      id: "task-5",
      description: "Practice a new skill for 30 minutes",
      rank: 2,
    },
  ],

  currTasks: [
    {
      id: "task-1",
      description: "Go for a 20-minute walk",
      rank: 1,
    },
    {
      id: "task-2",
      description: "Read 10 pages of a book",
      rank: 2,
    },
    {
      id: "task-3",
      description: "Finish a difficult programming assignment",
      rank: 3,
    },
    {
      id: "task-4",
      description: "Clean and organize your desk",
      rank: 1,
    },
    {
      id: "task-5",
      description: "Practice a new skill for 30 minutes",
      rank: 2,
    },
  ],

  // 1 = completed, 0 = incomplete
  taskCompleted: [1, 0, 0, 1, 0],

  numOfPhases: 5,
  currPhase: 2,

  currPet: 0,
  petHappiness: 75,
  streak: 7,
  lastLogin: new Date().toISOString(),
};
