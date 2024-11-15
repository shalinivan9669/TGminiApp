// src/components/GameHistoryList.tsx
'use client';

import React from 'react';
import { GameWithId } from '@/types';
import RoundsList from '@/components/RoundsList';

interface GameHistoryListProps {
  games: GameWithId[];
}

const GameHistoryList: React.FC<GameHistoryListProps> = ({ games }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">История игр</h2>
      {games.length === 0 ? (
        <p>У вас нет завершённых игр.</p>
      ) : (
        games.map((game) => (
          <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-semibold">
              {game.player1.username} vs {game.player2?.username || 'Неизвестный игрок'}
            </h3>
            <p>Ставка: {game.betAmount} ETH</p>
            <p>
              Победитель:{' '}
              {game.winner === 'draw'
                ? 'Ничья'
                : game.winner === 'player1'
                ? game.player1.username
                : game.player2?.username}
            </p>
            <RoundsList rounds={game.rounds} />
          </div>
        ))
      )}
    </div>
  );
};

export default GameHistoryList;
