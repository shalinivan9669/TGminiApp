// src/components/ConfirmJoinButton.tsx
import React, { useState } from 'react';
import { db } from '@/firebase/adminApp';
import { doc, updateDoc, FieldValue } from 'firebase-admin/firestore';
import { useAppContext } from '@/app/context/AppContext';

interface Game {
  id: string;
  player1: {
    userId: string;
    telegramId: string;
    username: string;
  };
  player2: {
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

interface ConfirmJoinButtonProps {
  game: Game;
}

const ConfirmJoinButton: React.FC<ConfirmJoinButtonProps> = ({ game }) => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const gameRef = doc(db, 'games', game.id);

      // Добавляем раунды
      const initialRounds = [
        { roundNumber: 1, player1Move: null, player2Move: null, result: null },
        { roundNumber: 2, player1Move: null, player2Move: null, result: null },
        { roundNumber: 3, player1Move: null, player2Move: null, result: null },
      ];

      await updateDoc(gameRef, {
        rounds: initialRounds,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Отправляем уведомление Player 2 о начале игры
      const notifyResponse = await fetch('/api/notifications/notifyFinalResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: game.id, finalResult: 'Игра началась!' }),
      });

      if (!notifyResponse.ok) {
        throw new Error('Failed to notify Player 2');
      }

      // Можно добавить уведомление или другой UX фидбек
    } catch (err) {
      console.error('Ошибка при подтверждении игры:', err);
      setError('Не удалось подтвердить игру. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? 'Подтверждение...' : 'Подтвердить участие'}
      </button>
    </div>
  );
};

export default ConfirmJoinButton;
