// src/app/context/AppContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextProps {
  user: string | null;
  setUser: (user: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Все');
  const [selectedFilter, setSelectedFilter] = useState<string>('Все');

  return (
    <AppContext.Provider value={{ user, setUser, activeTab, setActiveTab, selectedFilter, setSelectedFilter }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
