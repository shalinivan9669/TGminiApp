// src/app/collections/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import CharacterCard from '@/components/CharacterCard';
import Tabs from '@/components/Tabs';
import Filters from '@/components/Filters';
import { useAppContext } from '../context/AppContext';
import Link from 'next/link';

const Collections: React.FC = () => {
  const { activeTab, setActiveTab, selectedFilter, setSelectedFilter } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = ['Все', 'Изображения', 'Описание', 'Рейтинги'];
  const filters = ['Рейтинг > 4', 'Новые', 'Популярные'];

  const collections = [
    // Пустой массив для тестирования
    // Добавьте больше коллекций по необходимости
  ];

  const availableNFTs = [
    {
      imageUrl: '/images/nft1.jpg',
      name: 'NFT 1',
      description: 'Описание NFT 1.',
    },
    {
      imageUrl: '/images/nft2.jpg',
      name: 'NFT 2',
      description: 'Описание NFT 2.',
    },
    // Добавьте больше NFT по необходимости
  ];

  // Обработчик закрытия модального окна по клавише Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <Filters options={filters} selectedOption={selectedFilter} onFilterChange={setSelectedFilter} />
        
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {collections.map((collection, index) => (
              <CharacterCard
                key={index}
                imageUrl={collection.imageUrl}
                name={collection.name}
                description={collection.description}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-lg mb-4">У вас пока нет коллекций.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Купить новые NFT
            </button>
          </div>
        )}

        {/* Модальное окно */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 w-full h-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/3 max-h-full rounded-lg shadow-lg overflow-y-auto">
              {/* Заголовок модального окна */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Доступные NFT</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Закрыть модальное окно"
                >
                  &times;
                </button>
              </div>
              
              {/* Содержимое модального окна */}
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {availableNFTs.map((nft, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
                      <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{nft.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{nft.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Нижняя часть модального окна */}
              <div className="p-4 border-t flex justify-center">
                <a
                  href="https://opensea.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Перейти на OpenSea
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Collections;
