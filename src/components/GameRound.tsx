// src/components/GameRound.tsx
import React from 'react';
import { Game } from '@/types'; // Убедитесь, что импортируется правильный интерфейс

interface GameRoundProps {
  game: Game; // Используем интерфейс Game из вашего файла типов, где player2 опционален
  currentPlayer: 'player1' | 'player2';
}

const GameRound: React.FC<GameRoundProps> = ({ game, currentPlayer }) => {
  // Определяем соперника в зависимости от текущего игрока
  const opponent = currentPlayer === 'player1' ? game.player2 : game.player1;

  // Обрабатываем случай, когда соперник может быть undefined
  const opponentUsername = opponent?.username || 'Соперник отсутствует';

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow">
      <h4 className="text-lg font-semibold mb-2">Раунд игры</h4>
      <p>Соперник: {opponentUsername}</p>

      {/* Отображение раундов игры */}
      {game.rounds && game.rounds.length > 0 ? (
        game.rounds.map((round, index) => (
          <div key={index} className="mt-4">
            <h5 className="font-semibold">Раунд {round.roundNumber}</h5>
            <p>
              Ваш ход:{' '}
              {currentPlayer === 'player1'
                ? round.player1Move || 'Ожидание...'
                : round.player2Move || 'Ожидание...'}
            </p>
            <p>
              Ход соперника:{' '}
              {currentPlayer === 'player1'
                ? round.player2Move || 'Ожидание...'
                : round.player1Move || 'Ожидание...'}
            </p>
            <p>Результат: {round.result || 'Еще не определен'}</p>
          </div>
        ))
      ) : (
        <p>Раунды еще не начались.</p>
      )}

      {/* Дополнительная логика для действий игрока */}
      {/* Например, кнопка для совершения хода */}
    </div>
  );
};

export default GameRound;
