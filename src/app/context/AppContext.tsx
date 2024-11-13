// src/app/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  user: {
    id: string;
    telegramId: string;
    username: string;
    imageUrl?: string;
  } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{
      id: string;
      telegramId: string;
      username: string;
      imageUrl?: string;
    } | null>
  >;
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
    telegramId: string;
    username: string;
    imageUrl?: string;
  } | null>(null);

  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      // Попытка получить userId из localStorage
      const storedUserId = localStorage.getItem('userId');
      const storedTelegramId = localStorage.getItem('telegramId');
      const storedUsername = localStorage.getItem('username');
      const storedImageUrl = localStorage.getItem('imageUrl');

      if (storedUserId && storedTelegramId && storedUsername) {
        // Если данные есть в localStorage, устанавливаем пользователя
        setUser({
          id: storedUserId,
          telegramId: storedTelegramId,
          username: storedUsername,
          imageUrl: storedImageUrl || undefined,
        });
        console.log(`Пользователь загружен из localStorage: ${storedUserId}`);
      } else {
        // Если нет, пытаемся получить из URL-параметров
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userid');
        if (userId) {
          // Создаем фиктивные telegramId и username на основе userId
          const telegramId = `telegram_${userId}`;
          const username = `User_${userId}`;

          const newUser = {
            id: userId,
            telegramId,
            username,
            imageUrl: undefined, // Можно расширить для получения imageUrl из URL-параметров
          };

          setUser(newUser);
          console.log(`Пользователь установлен из URL-параметров: ${userId}`);

          // Сохраняем в localStorage для дальнейшего использования
          localStorage.setItem('userId', userId);
          localStorage.setItem('telegramId', telegramId);
          localStorage.setItem('username', username);
          if (newUser.imageUrl) {
            localStorage.setItem('imageUrl', newUser.imageUrl);
          }
        } else {
          console.warn('userId отсутствует в URL-параметрах и localStorage.');
        }
      }
    } else {
      // Логика получения userId из Telegram Web Apps будет добавлена позже
      // Пока можно оставить пустым или добавить заглушку
      console.warn('Telegram SDK не инициализирован. Пользователь не установлен.');
    }
  }, []);

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
