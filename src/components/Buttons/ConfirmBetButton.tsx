// src/components/Buttons/ConfirmBetButton.tsx
import React, { useState } from 'react';
import { Game as GameType } from '@/types';
import Modal from '@/components/UI/Modal';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';

interface GameWithId extends GameType {
  id: string;
}

interface ConfirmBetButtonProps {
  game: GameWithId;
}

const ConfirmBetButton: React.FC<ConfirmBetButtonProps> = ({ game }) => {
  const { user } = useAppContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAccept = async () => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/acceptBet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при подтверждении ставки');
      }

      setIsModalOpen(false);
      // Дополнительные действия после успешного подтверждения, например, уведомления
    } catch (err: any) {
      console.error('Ошибка при подтверждении ставки:', err);
      setError(err.message || 'Не удалось подтвердить ставку. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/rejectBet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при отклонении ставки');
      }

      setIsModalOpen(false);
      // Дополнительные действия после успешного отклонения, например, уведомления
    } catch (err: any) {
      console.error('Ошибка при отклонении ставки:', err);
      setError(err.message || 'Не удалось отклонить ставку. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mt-2"
      >
        Подтвердить ставку
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Подтвердить ставку</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <p>Вы уверены, что хотите подтвердить ставку игрока &quot;{game.player2?.username}&quot;?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Подтверждаю...' : 'Принять'}
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Отклоняю...' : 'Отклонить'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ConfirmBetButton;
