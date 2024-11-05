// src/components/CharacterCard.tsx
import React from 'react';

interface CharacterCardProps {
  imageUrl: string;
  name: string;
  description: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ imageUrl, name, description }) => {
  return (
    <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
