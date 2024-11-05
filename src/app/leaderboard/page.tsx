'use client';

import React from 'react';
import CharacterCard from '@/components/CharacterCard';
import Tabs from '@/components/Tabs';
import Filters from '@/components/Filters';
import { useAppContext } from '../context/AppContext';

const Leaderboard: React.FC = () => {
  const { activeTab, setActiveTab, selectedFilter, setSelectedFilter } = useAppContext();

  const tabs = ['Все', 'Месяц', 'Год'];
  const filters = ['Рейтинг > 4.5', 'Новые', 'Популярные'];

  const leaders = [
    {
      imageUrl: '/images/leader1.jpg',
      name: 'Лидер 1',
      description: 'Описание лидера 1.',
    },
    {
      imageUrl: '/images/leader2.jpg',
      name: 'Лидер 2',
      description: 'Описание лидера 2.',
    },
    // Добавьте больше лидеров по необходимости
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Filters options={filters} selectedOption={selectedFilter} onFilterChange={setSelectedFilter} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {leaders.map((leader, index) => (
            <CharacterCard
              key={index}
              imageUrl={leader.imageUrl}
              name={leader.name}
              description={leader.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
