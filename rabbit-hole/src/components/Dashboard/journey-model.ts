
/* =========================================
   DATABASE TYPES
========================================= */

export type Rank = 1 | 2 | 3;

export type Task = {
  id: string;
  description: string;
  rank: Rank;
};

export type Profile = {
  id: string;
  goal?: string;
}

export type User = {
  id: string;
  username: string;
  profile: Profile;
};

/* =========================================
   STORAGE
========================================= */

export const PROFILE_KEY = "wonderland-profile";

export const parseSavedProfile = (saved: string | null): Profile | null => {
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as Profile;

    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.currTasks) ||
      !Array.isArray(parsed.taskCompleted) ||
      typeof parsed.numOfPhases !== "number" ||
      typeof parsed.currPhase !== "number"
    ) {
      return null;
    }

    return {
      ...parsed,
      taskCompleted: parsed.currTasks.map((_, index) =>
        parsed.taskCompleted[index] === 1 ? 1 : 0
      ),
    };
  } catch {
    return null;
  }
};

/* =========================================
   HAPPINESS
========================================= */

export const HAPPINESS_GAIN = 10;
export const MISSED_DAY_LOSS = 5;

export const clampHappiness = (value: number): number =>
  Math.max(0, Math.min(100, value));

export const gainHappiness = (current: number): number =>
  clampHappiness(current + HAPPINESS_GAIN);

export const loseHappiness = (current: number): number =>
  clampHappiness(current - MISSED_DAY_LOSS);

/* =========================================
   TASK PROGRESS
========================================= */

export const completedTaskCount = (profile: Profile): number =>
  profile.taskCompleted.filter((value) => value === 1).length;

export const remainingTaskCount = (profile: Profile): number =>
  Math.max(0, profile.currTasks.length - completedTaskCount(profile));

export const allTasksCompleted = (profile: Profile): boolean =>
  profile.currTasks.length > 0 &&
  completedTaskCount(profile) === profile.currTasks.length;

export const isTaskCompleted = (
  profile: Profile,
  index: number
): boolean => profile.taskCompleted[index] === 1;

/* =========================================
   PHASE PROGRESS
========================================= */

export type PhaseProgress = {
  phaseNumber: number;
  complete: boolean;
  current: boolean;
};

export const phaseProgress = (profile: Profile): PhaseProgress[] => {
  const total = Math.max(0, Math.floor(profile.numOfPhases));
  const current = Math.min(
    total,
    Math.max(1, Math.floor(profile.currPhase))
  );

  return Array.from({ length: total }, (_, index) => {
    const phaseNumber = index + 1;

    return {
      phaseNumber,
      complete: phaseNumber < current,
      current: phaseNumber === current,
    };
  });
};

/* =========================================
   STREAK
========================================= */

export const streak = (profile: Profile): number => profile.streak;

/* =========================================
   DATE AND TIME
========================================= */

export const utcDay = (date: number | string | Date): string =>
  new Date(date).toISOString().slice(0, 10);

export const timeOfDay = (
  date: number | string | Date
): "dawn" | "day" | "dusk" | "night" => {
  const hour = new Date(date).getUTCHours();

  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
};

/* =========================================
   HAPPINESS MOOD
========================================= */

export const happinessMood = (happiness: number): string => {
  if (happiness >= 80) return "Over the moon";
  if (happiness >= 50) return "Happy as can be";
  if (happiness >= 25) return "A little wistful";
  return "Ready for company";
};
