// src/app/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  user: {
    id: string;
    telegramId: number;
    username: string;
    imageUrl?: string;
  } | null;
  setUser: React.Dispatch<React.SetStateAction<{
    id: string;
    telegramId: number;
    username: string;
    imageUrl?: string;
  } | null>>;
}

const AppContext = createContext<AppContextProps>({
  activeTab: 'Поиск',
  setActiveTab: () => {},
  selectedFilter: 'Все',
  setSelectedFilter: () => {},
  user: null,
  setUser: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<string>('Поиск');
  const [selectedFilter, setSelectedFilter] = useState<string>('Все');
  const [user, setUser] = useState<{
    id: string;
    telegramId: number;
    username: string;
    imageUrl?: string;
  } | null>(null);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedFilter,
        setSelectedFilter,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
