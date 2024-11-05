'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';
import CharacterCard from '@/components/CharacterCard';

const Profile: React.FC = () => {
  const { user, setUser } = useAppContext();

  const handleLogout = () => {
    // Логика выхода пользователя
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img src="/images/user-avatar.jpg" alt="Аватар пользователя" className="w-24 h-24 rounded-full mb-4" />
            <h2 className="text-xl font-semibold mb-2">{user}</h2>
            <p className="text-gray-600 mb-4">Описание профиля пользователя.</p>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Выйти
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Вы не вошли в систему</h2>
            <button
              onClick={() => setUser('Имя пользователя')}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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
