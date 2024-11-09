// src/components/Buttons/JoinGameButton.tsx
import React, { useState } from 'react';
import { Game } from '@/types';
import Modal from '@/components/UI/Modal';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation'; // Добавьте этот импорт

interface JoinGameButtonProps {
  game: Game;
}

const JoinGameButton: React.FC<JoinGameButtonProps> = ({ game }) => {
  const { user } = useAppContext();
  const router = useRouter(); // Инициализируйте useRouter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleJoinGame = async () => {
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
          userId: user?.id,
          telegramId: user?.telegramId,
          username: user?.username,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Не удалось присоединиться к игре');
      }

      const data = await response.json();
      setIsModalOpen(false);
      // Перенаправление на страницу игры
      router.push(`/play/${game.id}`);
    } catch (err: any) {
      console.error('Ошибка при присоединении к игре:', err);
      setError(err.message || 'Не удалось присоединиться к игре. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-2"
      >
        Присоединиться к игре
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Присоединиться к игре</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <p>Вы уверены, что хотите присоединиться к игре "{game.name}"?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleJoinGame}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Присоединяюсь...' : 'Присоединиться'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default JoinGameButton;
