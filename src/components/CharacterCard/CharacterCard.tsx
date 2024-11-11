// src/components/CharacterCard.tsx

import React from 'react';
import Image from 'next/image';
import { Game } from '@/types';

interface CharacterCardProps {
  game: Game;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ game }) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={game.imageUrl || '/images/game_placeholder.jpg'}
        alt={game.name.replace(/"/g, '&quot;')}
        width={128} // 32 * 4 (так как w-32 обычно соответствует 128px)
        height={128}
        className="object-cover rounded-full mb-4"
      />
      <h3 className="text-lg font-semibold">{game.name.replace(/"/g, '&quot;')}</h3>
      <p className="text-gray-600">{game.description.replace(/"/g, '&quot;')}</p>
      <p className="mt-2">Ставка: {game.betAmount} ETH</p>
      <p className="mt-1">Статус: {game.status}</p>
      {game.status === 'active' && <p>Текущий раунд: {game.rounds.length + 1}</p>}
    </div>
  );
};

export default CharacterCard;
