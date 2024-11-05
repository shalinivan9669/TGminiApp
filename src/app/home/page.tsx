'use client';

import React from 'react';
import CharacterCard from '@/components/CharacterCard';
import Tabs from '@/components/Tabs';
import Filters from '@/components/Filters';
import { useAppContext } from '../context/AppContext';

const Home: React.FC = () => {
  const { activeTab, setActiveTab, selectedFilter, setSelectedFilter } = useAppContext();

  const tabs = ['Все', 'Новые', 'Популярные'];
  const filters = ['Фильтр 1', 'Фильтр 2', 'Фильтр 3'];

  const characters = [
    {
      imageUrl: '/images/character1.jpg',
      name: 'Персонаж 1',
      description: 'Описание персонажа 1.',
    },
    {
      imageUrl: '/images/character2.jpg',
      name: 'Персонаж 2',
      description: 'Описание персонажа 2.',
    },
    // Добавьте больше персонажей по необходимости
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Filters options={filters} selectedOption={selectedFilter} onFilterChange={setSelectedFilter} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {characters.map((character, index) => (
            <CharacterCard
              key={index}
              imageUrl={character.imageUrl}
              name={character.name}
              description={character.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
