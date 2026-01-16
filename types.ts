export interface UserProfile {
  name: string;
  startedAt: number;
}

export interface ModuleProgress {
  conceptsRead: string[];
  exerciseCompleted: boolean;
  quizScore: number | null;
  completed: boolean;
}

export interface AppStats {
  totalTimeSpent: number; // in minutes
  lastAccessed: number;
}

export interface AppData {
  user: UserProfile;
  progress: Record<string, ModuleProgress>;
  stats: AppStats;
}

export interface ModuleDef {
  id: number;
  title: string;
  duration: string;
}

export const TOTAL_MODULES = 10;