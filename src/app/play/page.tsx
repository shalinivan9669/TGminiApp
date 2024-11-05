'use client';

import React from 'react';
import CharacterCard from '@/components/CharacterCard';
import Tabs from '@/components/Tabs';
import Filters from '@/components/Filters';
import { useAppContext } from '../context/AppContext';

const Play: React.FC = () => {
  const { activeTab, setActiveTab, selectedFilter, setSelectedFilter } = useAppContext();

  const tabs = ['Поиск', 'Активные игры', 'История игр'];
  const filters = ['Фильтр A', 'Фильтр B', 'Фильтр C'];

  const games = [
    {
      imageUrl: '/images/game1.jpg',
      name: 'Игра 1',
      description: 'Описание игры 1.',
    },
    {
      imageUrl: '/images/game2.jpg',
      name: 'Игра 2',
      description: 'Описание игры 2.',
    },
    // Добавьте больше игр по необходимости
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Filters options={filters} selectedOption={selectedFilter} onFilterChange={setSelectedFilter} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {games.map((game, index) => (
            <CharacterCard
              key={index}
              imageUrl={game.imageUrl}
              name={game.name}
              description={game.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Play;
