// src/components/CharacterCard.tsx
import React from 'react';
import { Game } from '@/types';

interface CharacterCardProps {
  game: Game;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ game }) => {
  return (
    <div className="flex flex-col items-center">
      <img src={game.imageUrl || '/images/game_placeholder.jpg'} alt={game.name} className="w-32 h-32 object-cover rounded-full mb-4" />
      <h3 className="text-lg font-semibold">{game.name}</h3>
      <p className="text-gray-600">{game.description}</p>
      <p className="mt-2">Ставка: {game.betAmount} ETH</p>
      <p className="mt-1">Статус: {game.status}</p>
      {game.status === 'active' && <p>Текущий раунд: {game.rounds.length + 1}</p>}
    </div>
  );
};

export default CharacterCard;
