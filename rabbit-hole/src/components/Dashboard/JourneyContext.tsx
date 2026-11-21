"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  PROFILE_KEY,
  gainHappiness,
  parseSavedProfile,
  type Profile,
} from "./journey-model";

type JourneyContextValue = {
  profile: Profile | null;
  storageUnavailable: boolean;
  setProfile: (profile: Profile | null) => void;
  toggleTask: (index: number) => void;
  advancePhase: () => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

type JourneyProviderProps = {
  children: ReactNode;
  initialProfile?: Profile;
  persist?: boolean;
};

export function JourneyProvider({
  children,
  initialProfile,
  persist = true,
}: JourneyProviderProps) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    if (initialProfile) return initialProfile;

    try {
      return parseSavedProfile(localStorage.getItem(PROFILE_KEY));
    } catch {
      return null;
    }
  });

  const [storageUnavailable, setStorageUnavailable] = useState(false);

  useEffect(() => {
    if (!persist) return;

    try {
      if (profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(PROFILE_KEY);
      }

      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }, [profile, persist]);

  function toggleTask(index: number) {
    setProfile((current) => {
      if (!current || index < 0 || index >= current.currTasks.length) {
        return current;
      }

      const wasCompleted = current.taskCompleted[index] === 1;
      const nextCompleted = [...current.taskCompleted];

      nextCompleted[index] = wasCompleted ? 0 : 1;

      return {
        ...current,
        taskCompleted: nextCompleted,
        petHappiness: wasCompleted
          ? current.petHappiness
          : gainHappiness(current.petHappiness),
      };
    });
  }

  function advancePhase() {
    setProfile((current) => {
      if (!current) return current;

      const allCompleted =
        current.currTasks.length > 0 &&
        current.currTasks.every(
          (_, index) => current.taskCompleted[index] === 1
        );

      if (!allCompleted || current.currPhase >= current.numOfPhases) {
        return current;
      }

      return {
        ...current,
        currPhase: current.currPhase + 1,
      };
    });
  }

  return (
    <JourneyContext.Provider
      value={{
        profile,
        storageUnavailable,
        setProfile,
        toggleTask,
        advancePhase,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);

  if (!context) {
    throw new Error("JourneyProvider is required");
  }

  return context;
}
