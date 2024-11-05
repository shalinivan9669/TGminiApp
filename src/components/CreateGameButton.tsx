// src/components/CreateGameButton.tsx
import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { db } from '@/firebase/adminApp';
import { useAppContext } from '@/app/context/AppContext';

const CreateGameButton: React.FC = () => {
  const { user } = useAppContext(); // Предполагается, что у вас есть контекст для пользователя
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCreateGame = async () => {
    if (!betAmount || betAmount <= 0) {
      setError('Пожалуйста, введите корректный размер ставки.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games/createGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          telegramId: user.telegramId,
          username: user.username,
          betAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const data = await response.json();
      setIsModalOpen(false);
      // Можно добавить уведомление или другой UX фидбек
    } catch (err) {
      console.error('Ошибка при создании игры:', err);
      setError('Не удалось создать игру. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
      >
        Создать игру
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Создать новую игру</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
              type="number"
              placeholder="Размер ставки (ETH)"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleCreateGame}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              {loading ? 'Создаётся...' : 'Подтвердить'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateGameButton;
