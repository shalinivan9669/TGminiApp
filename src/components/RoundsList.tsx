// src/components/RoundsList.tsx
'use client';

import React from 'react';
import { Round } from '@/types';

interface RoundsListProps {
  rounds: Round[];
  currentPlayerRole?: 'player1' | 'player2';
}

const RoundsList: React.FC<RoundsListProps> = ({ rounds, currentPlayerRole }) => {
  if (rounds.length === 0) {
    return <p>Пока нет раундов.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Раунды</h2>
      {rounds.map((round) => (
        <div key={round.roundNumber} className="border p-2 mb-2 rounded">
          <p>Раунд {round.roundNumber}</p>
          <p>Ход игрока 1: {round.player1Move || 'Не сделан'}</p>
          <p>Ход игрока 2: {round.player2Move || 'Не сделан'}</p>
          <p>
            Результат:{' '}
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
  );
};

export default RoundsList;
