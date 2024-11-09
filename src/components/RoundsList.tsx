// src/components/RoundsList.tsx
import React from 'react';
import { Round } from '@/types';

interface RoundsListProps {
  rounds: Round[];
}

const RoundsList: React.FC<RoundsListProps> = ({ rounds }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Раунды</h2>
      {rounds.length === 0 ? (
        <p>Пока нет раундов.</p>
      ) : (
        rounds.map((round) => (
          <div key={round.roundNumber} className="border p-2 rounded mt-2">
            <p>Раунд {round.roundNumber}</p>
            <p>Ваш ход: {round.playerMove || '—'}</p>
            <p>Ход противника: {round.opponentMove || '—'}</p>
            <p>Результат: {round.result || '—'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RoundsList;
