// src/components/Buttons/CreateGameButton.tsx
import React, { useState } from 'react';
import Modal from '@/components/UI/Modal';
import { useAppContext } from '@/app/context/AppContext';
import { useRouter } from 'next/navigation';

const CreateGameButton: React.FC = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateGame = async () => {
    if (!user) {
      setError('Пользователь не авторизован.');
      return;
    }

    if (betAmount <= 0) {
      setError('Ставка должна быть больше нуля.');
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Не удалось создать игру');
      }

      console.log('Игра создана успешно:', data);
      setIsModalOpen(false);
      router.push(`/play/${data.gameId}`);
    } catch (err: any) {
      console.error('Ошибка при создании игры:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto"
      >
        Создать игру
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Создать новую игру</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex flex-col space-y-4">
              <label className="flex flex-col">
                <span className="mb-1">Ставка (ETH):</span>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="border border-gray-300 p-2 rounded-lg"
                  min="0"
                  step="0.01"
                />
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateGame}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full sm:w-auto"
                >
                  {loading ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateGameButton;
