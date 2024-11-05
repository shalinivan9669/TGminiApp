// src/components/JoinGameButton.tsx
import React, { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';

interface Game {
  id: string;
  player1: {
    userId: string;
    telegramId: string;
    username: string;
  };
  player2: null | {
    userId: string;
    telegramId: string;
    username: string;
  };
  betAmount: number;
  status: string;
  rounds: any[];
  createdAt: any;
  updatedAt: any;
}

interface JoinGameButtonProps {
  game: Game;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ game }) => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleJoinGame = async () => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/joinGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          userId: user.id,
          telegramId: user.telegramId,
          username: user.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join game');
      }

      // Можно добавить уведомление или другой UX фидбек
    } catch (err) {
      console.error('Ошибка при присоединении к игре:', err);
      setError('Не удалось присоединиться к игре. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleJoinGame}
        disabled={loading}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? 'Присоединяюсь...' : 'Присоединиться'}
      </button>
    </div>
  );
};

export default JoinGameButton;
