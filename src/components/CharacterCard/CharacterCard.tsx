// src/components/CharacterCard.tsx

import React from 'react';
import Image from 'next/image';

interface CharacterCardProps {
  imageUrl: string;
  name: string;
  description: string;
  betAmount?: number; // Опционально, если нужно
  status?: string;    // Опционально, если нужно
  rounds?: { roundNumber: number }[]; // Опционально, если нужно
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  imageUrl,
  name,
  description,
  betAmount,
  status,
  rounds,
}) => {
  // Безопасная обработка 'name' и 'description'
  const safeName = name ?? 'Без имени';
  const safeDescription = description ?? 'Нет описания';

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden p-4">
      <Image
        src={imageUrl || '/images/game_placeholder.jpg'}
        alt={safeName.replace(/"/g, '&quot;')}
        width={128} // 32 * 4 (так как w-32 обычно соответствует 128px)
        height={128}
        className="object-cover rounded-full mb-4"
      />
      <h3 className="text-lg font-semibold">{safeName.replace(/"/g, '&quot;')}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {safeDescription.replace(/"/g, '&quot;')}
      </p>
      {betAmount !== undefined && (
        <p className="mt-2 text-gray-800 dark:text-gray-200">Ставка: {betAmount} ETH</p>
      )}
      {status && (
        <p className="mt-1 text-gray-800 dark:text-gray-200">Статус: {status}</p>
      )}
      {status === 'active' && rounds && (
        <p className="mt-1 text-gray-800 dark:text-gray-200">
          Текущий раунд: {rounds.length + 1}
        </p>
      )}
    </div>
  );
};

export default CharacterCard;
