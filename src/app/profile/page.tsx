// src/app/play/Profile.tsx
'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';

const Profile: React.FC = () => {
  const { user, setUser } = useAppContext();

  const handleLogout = () => {
    // Логика выхода пользователя
    setUser(null);
  };

  const handleLogin = () => {
    // Пример логики входа пользователя
    setUser({
      id: 'user123',
      telegramId: '987654321', // Изменено на строку
      username: 'Имя пользователя',
      imageUrl: '/images/user-avatar.jpg', // Опционально
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Профиль пользователя</h1>
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Отображение аватара пользователя */}
            <img
              src={user.imageUrl || "/images/default-avatar.jpg"}
              alt="Аватар пользователя"
              className="w-24 h-24 rounded-full mb-4 mx-auto sm:mx-0"
            />
            {/* Отображение имени пользователя */}
            <h2 className="text-xl font-semibold mb-2 text-center sm:text-left">{user.username}</h2>
            <p className="text-gray-600 mb-4 text-center sm:text-left">Описание профиля пользователя.</p>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
            >
              Выйти
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-center sm:text-left">Вы не вошли в систему</h2>
            <button
              onClick={handleLogin}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              Войти
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
