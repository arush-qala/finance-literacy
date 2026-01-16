import { AppData, ModuleProgress, TOTAL_MODULES } from '../types';

const STORAGE_KEYS = {
  USER: 'financeFluency_user',
  PROGRESS: 'financeFluency_progress',
  STATS: 'financeFluency_stats',
};

const INITIAL_USER = {
  name: 'Guest',
  startedAt: Date.now(),
};

const INITIAL_STATS = {
  totalTimeSpent: 0,
  lastAccessed: Date.now(),
};

const createInitialProgress = (): Record<string, ModuleProgress> => {
  const progress: Record<string, ModuleProgress> = {};
  for (let i = 1; i <= TOTAL_MODULES; i++) {
    progress[i.toString()] = {
      conceptsRead: [],
      exerciseCompleted: false,
      quizScore: null,
      completed: false,
    };
  }
  return progress;
};

export const storageService = {
  initialize: (): AppData => {
    let user = localStorage.getItem(STORAGE_KEYS.USER);
    let progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    let stats = localStorage.getItem(STORAGE_KEYS.STATS);

    const now = Date.now();

    if (!user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    }
    if (!progress) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(createInitialProgress()));
    }
    if (!stats) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(INITIAL_STATS));
    } else {
        // Update last accessed
        const statsObj = JSON.parse(stats);
        statsObj.lastAccessed = now;
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(statsObj));
    }

    return {
      user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!),
      progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS)!),
      stats: JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS)!),
    };
  },

  getData: (): AppData => {
    // If keys don't exist, initialize first
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
        return storageService.initialize();
    }
    return {
      user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}'),
      progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}'),
      stats: JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}'),
    };
  },

  updateUserName: (name: string) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    user.name = name;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  updateProgress: (moduleId: string, data: Partial<ModuleProgress>) => {
    const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
    if (progress[moduleId]) {
      progress[moduleId] = { ...progress[moduleId], ...data };
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    }
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    // We keep the user name, but reset startedAt
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || JSON.stringify(INITIAL_USER));
    user.startedAt = Date.now();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    // Re-init other keys
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(createInitialProgress()));
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(INITIAL_STATS));
  },
  
  // Debug method to force completion of previous modules for testing navigation
  debugCompleteModule: (moduleId: string) => {
      const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
      if (progress[moduleId]) {
        progress[moduleId].completed = true;
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      }
  }
};