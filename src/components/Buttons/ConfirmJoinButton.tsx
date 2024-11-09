// src/components/Buttons/ConfirmJoinButton.tsx
import React, { useState } from 'react';
import Modal from '@/components/UI/Modal';
import { useAppContext } from '@/app/context/AppContext';

interface ConfirmJoinButtonProps {
  gameId: string;
}

const ConfirmJoinButton: React.FC<ConfirmJoinButtonProps> = ({ gameId }) => {
  const { user } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/confirmGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to confirm game');
      }

      const data = await response.json();
      setIsModalOpen(false);
      // Можно добавить уведомление или другой UX фидбек
    } catch (err: any) {
      console.error('Ошибка при подтверждении игры:', err);
      setError(err.message || 'Не удалось подтвердить игру. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
      >
        Подтвердить участие
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Подтвердить участие</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <p>Вы уверены, что хотите подтвердить участие второго игрока?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Подтверждаю...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ConfirmJoinButton;
