// src/components/PendingGameActions.tsx
import React, { useState } from 'react';
import { GameWithId } from '@/types';
import { useAppContext } from '@/app/context/AppContext';

interface PendingGameActionsProps {
  game: GameWithId;
}

const PendingGameActions: React.FC<PendingGameActionsProps> = ({ game }) => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleAcceptBet = async () => {
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
        throw new Error(data.message || 'Ошибка при принятии ставки');
      }

      console.log('Ставка принята:', data);
      // Обновите состояние или добавьте уведомление
    } catch (err: any) {
      console.error('Ошибка при принятии ставки:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBet = async () => {
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

      console.log('Ставка отклонена:', data);
      // Обновите состояние или добавьте уведомление
    } catch (err: any) {
      console.error('Ошибка при отклонении ставки:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (user?.id !== game.creatorId || game.status !== 'pending') {
    return null;
  }

  return (
    <div className="mt-4">
      <p>
        Игрок {game.player2?.username} предлагает ставку: {game.pendingBetAmount} ETH
      </p>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex space-x-4 mt-2">
        <button
          onClick={handleAcceptBet}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Принятие...' : 'Принять ставку'}
        </button>
        <button
          onClick={handleRejectBet}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Отклонение...' : 'Отклонить ставку'}
        </button>
      </div>
    </div>
  );
};

export default PendingGameActions;
