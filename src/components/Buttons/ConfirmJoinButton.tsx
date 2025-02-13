// src/components/Buttons/ConfirmJoinButton.tsx
import React, { useState } from 'react';
import { Game as GameType } from '@/types';
import { useAppContext } from '@/app/context/AppContext';
import Modal from '@/components/UI/Modal';
import { useRouter } from 'next/navigation';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAcceptBet = async () => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/acceptBet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Не удалось принять ставку');
      }

      const data = await response.json();
      console.log('Ставка принята:', data);
      setIsModalOpen(false);
      // Опционально, переход к странице игры
      router.push(`/play/${game.id}`);
    } catch (err: any) {
      console.error('Ошибка при принятии ставки:', err);
      setError(err.message || 'Не удалось принять ставку');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBet = async () => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/rejectBet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Не удалось отклонить ставку');
      }

      const data = await response.json();
      console.log('Ставка отклонена:', data);
      setIsModalOpen(false);
      // Опционально, уведомление или обновление страницы
    } catch (err: any) {
      console.error('Ошибка при отклонении ставки:', err);
      setError(err.message || 'Не удалось отклонить ставку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Подтверждение присоединения</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <p>Вы уверены, что хотите принять ставку {game.pendingBetAmount} ETH от {game.player2?.username}?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleAcceptBet}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Принятие...' : 'Принять'}
              </button>
              <button
                onClick={handleRejectBet}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Отклонение...' : 'Отклонить'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ConfirmJoinButton;
