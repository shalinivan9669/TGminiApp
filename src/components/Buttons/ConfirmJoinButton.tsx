// src/components/Buttons/ConfirmJoinButton.tsx
import React, { useState } from 'react';
import { Game as GameType } from '@/types';
import { useAppContext } from '@/app/context/AppContext';
import Modal from '@/components/UI/Modal';
import { useRouter } from 'next/navigation';

// Создайте новый интерфейс, добавив свойство 'id'
interface GameWithId extends GameType {
  id: string;
}

interface ConfirmJoinButtonProps {
  game: GameWithId;
}

const ConfirmJoinButton: React.FC<ConfirmJoinButtonProps> = ({ game }) => {
  const { user } = useAppContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleConfirmJoin = async () => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Не удалось присоединиться к игре');
      }

      // Предполагается, что сервер возвращает данные игры
      const data = await response.json();
      setIsModalOpen(false);
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
            {error && <p className="text-red-500 mb-2">{error.replace(/"/g, '&quot;')}</p>}
            <p>Вы уверены, что хотите присоединиться к игре &quot;{game.name}&quot;?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmJoin}
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

export default ConfirmJoinButton;
