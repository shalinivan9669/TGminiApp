// src/components/GameRound.tsx
import React, { useState } from 'react';
import { db } from '@/firebase/clientApp'; // Используем клиентский SDK
import { doc, updateDoc, serverTimestamp, getDoc, FieldValue } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import { GameWithId } from '@/types'; // Импортируем интерфейс GameWithId

interface GameRoundProps {
  game: GameWithId;
  currentPlayer: 'player1' | 'player2';
}

const GameRound: React.FC<GameRoundProps> = ({ game, currentPlayer }) => {
  const { user } = useAppContext();
  const [move, setMove] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleMove = async () => {
    if (!move) {
      setError('Пожалуйста, выберите ход.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Находим индекс первого незавершенного раунда
      const roundIndex = game.rounds.findIndex(round => !round.result);
      if (roundIndex === -1) {
        setError('Все раунды уже завершены.');
        return;
      }

      const gameRef = doc(db, 'games', game.id);
      const moveField = currentPlayer === 'player1' ? 'player1Move' : 'player2Move';
      
      // Обновляем ход текущего игрока
      const updateData: Partial<GameWithId> & { updatedAt: FieldValue } = {
        [`rounds.${roundIndex}.${moveField}`]: move,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(gameRef, updateData);

      // Получаем обновленные данные игры
      const gameSnap = await getDoc(gameRef);
      if (!gameSnap.exists()) {
        throw new Error('Игра не существует.');
      }
      const updatedGame = gameSnap.data() as GameWithId;
      const currentRound = updatedGame.rounds[roundIndex];

      // Если оба игрока сделали ход, определяем результат
      if (currentRound.player1Move && currentRound.player2Move) {
        const result = determineRoundResult(currentRound.player1Move, currentRound.player2Move);
        await updateDoc(gameRef, {
          [`rounds.${roundIndex}.result`]: result,
          updatedAt: serverTimestamp(),
        });

        // Отправка уведомлений о результате раунда
        await fetch('/api/notifications/notifyRoundResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameId: game.id, roundNumber: roundIndex + 1, result }),
        });
      }
    } catch (err) {
      console.error('Ошибка при внесении хода:', err);
      setError('Не удалось внести ход. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  // Функция для определения результата раунда
  const determineRoundResult = (
    p1: 'rock' | 'paper' | 'scissors',
    p2: 'rock' | 'paper' | 'scissors'
  ): 'player1' | 'player2' | 'draw' => {
    if (p1 === p2) return 'draw';
    if (
      (p1 === 'rock' && p2 === 'scissors') ||
      (p1 === 'paper' && p2 === 'rock') ||
      (p1 === 'scissors' && p2 === 'paper')
    ) {
      return 'player1';
    }
    return 'player2';
  };

  // Определяем номер текущего раунда для отображения
  const currentRoundNumber = game.rounds.findIndex(round => !round.result) + 1;

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2">Раунд {currentRoundNumber}</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMove('rock')}
          className={`py-2 px-4 rounded ${
            move === 'rock' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Камень
        </button>
        <button
          onClick={() => setMove('paper')}
          className={`py-2 px-4 rounded ${
            move === 'paper' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Бумага
        </button>
        <button
          onClick={() => setMove('scissors')}
          className={`py-2 px-4 rounded ${
            move === 'scissors' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Ножницы
        </button>
      </div>
      <button
        onClick={handleMove}
        disabled={loading || !move}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? 'Подтверждаю...' : 'Подтвердить ход'}
      </button>
    </div>
  );
};

export default GameRound;
