// src/app/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextProps>({
  activeTab: 'Поиск',
  setActiveTab: () => {},
  selectedFilter: 'Все',
  setSelectedFilter: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<string>('Поиск');
  const [selectedFilter, setSelectedFilter] = useState<string>('Все');

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedFilter,
        setSelectedFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
