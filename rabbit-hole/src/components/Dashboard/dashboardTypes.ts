
import type { RefObject } from "react";
import type { Profile, Task, PhaseProgress } from "./journey-model";

export type DashboardProfile = Profile;
export type DashboardTask = Task;
export type JourneyPhase = PhaseProgress;
export type HelpDialogRef = RefObject<HTMLDialogElement | null>;
