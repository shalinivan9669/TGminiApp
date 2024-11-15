// src/components/MakeMoveButton.tsx
'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { GameWithId } from '@/types';

interface MakeMoveButtonProps {
  game: GameWithId;
  currentPlayerRole: 'player1' | 'player2';
}

const MakeMoveButton: React.FC<MakeMoveButtonProps> = ({ game, currentPlayerRole }) => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleMakeMove = async (move: 'rock' | 'paper' | 'scissors') => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/makeMove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, userId: user.id, move }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при выполнении хода');
      }

      console.log('Ход выполнен успешно:', data);
      // Можно добавить уведомление или обновить состояние
    } catch (err: any) {
      console.error('Ошибка при выполнении хода:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Проверка, является ли пользователь текущим игроком
  let isCurrentPlayer = false;
  if (game.currentPlayer === currentPlayerRole) {
    if (currentPlayerRole === 'player1') {
      isCurrentPlayer = user?.id === game.player1.userId;
    } else if (currentPlayerRole === 'player2' && game.player2) {
      isCurrentPlayer = user?.id === game.player2.userId;
    }
  }

  return (
    <div className="flex space-x-4 mt-2">
      <button
        onClick={() => handleMakeMove('rock')}
        disabled={loading || !isCurrentPlayer}
        className={`py-2 px-4 rounded ${
          !isCurrentPlayer
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Камень
      </button>
      <button
        onClick={() => handleMakeMove('paper')}
        disabled={loading || !isCurrentPlayer}
        className={`py-2 px-4 rounded ${
          !isCurrentPlayer
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Бумага
      </button>
      <button
        onClick={() => handleMakeMove('scissors')}
        disabled={loading || !isCurrentPlayer}
        className={`py-2 px-4 rounded ${
          !isCurrentPlayer
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Ножницы
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MakeMoveButton;
