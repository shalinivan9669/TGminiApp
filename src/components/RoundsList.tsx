// src/components/RoundsList.tsx
'use client';

import React from 'react';
import { Round } from '@/types';

interface RoundsListProps {
  rounds: Round[];
  currentPlayerRole?: 'player1' | 'player2';
}

const RoundsList: React.FC<RoundsListProps> = ({
  rounds,
  currentPlayerRole,
}) => {
  if (rounds.length === 0) {
    return <p className="text-center sm:text-left">Пока нет раундов.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
        Раунды
      </h2>
      <div className="space-y-4">
        {rounds.map((round) => (
          <div
            key={round.roundNumber}
            className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
          >
            <p className="font-semibold mb-2 text-center sm:text-left">
              Раунд {round.roundNumber}
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p>
                  <span className="font-medium">Ваш ход:</span>{' '}
                  {currentPlayerRole === 'player1'
                    ? round.player1Move || 'Не сделан'
                    : round.player2Move || 'Не сделан'}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Ход соперника:</span>{' '}
                  {currentPlayerRole === 'player1'
                    ? round.player2Move || 'Не сделан'
                    : round.player1Move || 'Не сделан'}
                </p>
              </div>
            </div>
            <p className="mt-2">
              <span className="font-medium">Результат:</span>{' '}
              {round.result
                ? round.result === 'draw'
                  ? 'Ничья'
                  : round.result === 'player1'
                  ? 'Победил игрок 1'
                  : 'Победил игрок 2'
                : 'Ожидание результата'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundsList;
