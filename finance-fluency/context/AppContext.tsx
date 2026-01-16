import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData } from '../types';
import { storageService } from '../services/storageService';

interface AppContextType {
  data: AppData | null;
  refreshData: () => void;
  updateUserName: (name: string) => void;
  markModuleComplete: (moduleId: number) => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData | null>(null);

  const refreshData = useCallback(() => {
    const newData = storageService.getData();
    setData(newData);
  }, []);

  useEffect(() => {
    storageService.initialize();
    refreshData();
  }, [refreshData]);

  const updateUserName = (name: string) => {
    storageService.updateUserName(name);
    refreshData();
  };

  const markModuleComplete = (moduleId: number) => {
      storageService.updateProgress(moduleId.toString(), { completed: true });
      refreshData();
  };

  const resetProgress = () => {
    storageService.resetData();
    refreshData();
  };

  return (
    <AppContext.Provider value={{ data, refreshData, updateUserName, markModuleComplete, resetProgress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};