// src/app/play/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import CharacterCard from '@/components/CharacterCard';
import Tabs from '@/components/Tabs';
import Filters from '@/components/Filters';
import CreateGameButton from '@/components/Buttons/CreateGameButton';
import JoinGameButton from '@/components/Buttons/JoinGameButton';
import { useAppContext } from '@/app/context/AppContext';
import { db } from '@/firebase/clientApp';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Game } from '@/types';
import { useRouter } from 'next/navigation';

// Расширенный интерфейс для игр с 'id' и 'filter'
interface GameWithId extends Game {
  id: string;
  filter?: string;
}

const Play: React.FC = () => {
  const { activeTab, setActiveTab, selectedFilter, setSelectedFilter, user } = useAppContext();
  const router = useRouter();

  const tabs = ['Поиск', 'Активные игры', 'История игр'];
  const filters = ['Все', 'Фильтр A', 'Фильтр B', 'Фильтр C'];

  // Состояния для разных типов игр
  const [openGames, setOpenGames] = useState<GameWithId[]>([]);
  const [activeGames, setActiveGames] = useState<GameWithId[]>([]);
  const [gameHistory, setGameHistory] = useState<GameWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // Подписка на открытые игры (статус 'open')
    const openGamesQuery = query(collection(db, 'games'), where('status', '==', 'open'));
    const unsubscribeOpen = onSnapshot(
      openGamesQuery,
      (snapshot) => {
        const games: GameWithId[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            betAmount: data.betAmount,
            status: data.status,
            rounds: data.rounds || [],
            players: data.players || [],
            finalResult: data.finalResult,
            filter: data.filter, // Добавлено для фильтрации
            player1: data.player1,
            player2: data.player2,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            // Добавьте другие свойства, если необходимо
          };
        });
        setOpenGames(games);
        setLoading(false);
      },
      (err) => {
        console.error('Ошибка при получении открытых игр:', err);
        setError('Не удалось загрузить открытые игры.');
        setLoading(false);
      }
    );

    // Подписка на активные игры текущего пользователя (статус 'active')
    if (user) {
      const activeGamesQuery = query(
        collection(db, 'games'),
        where('status', '==', 'active'),
        where('players', 'array-contains', user.id) // Предполагается, что поле 'players' - массив userId
      );
      const unsubscribeActive = onSnapshot(
        activeGamesQuery,
        (snapshot) => {
          const games: GameWithId[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              imageUrl: data.imageUrl,
              betAmount: data.betAmount,
              status: data.status,
              rounds: data.rounds || [],
              players: data.players || [],
              finalResult: data.finalResult,
              filter: data.filter, // Добавлено для фильтрации
              player1: data.player1,
              player2: data.player2,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              // Добавьте другие свойства, если необходимо
            };
          });
          setActiveGames(games);
          setLoading(false);
        },
        (err) => {
          console.error('Ошибка при получении активных игр:', err);
          setError('Не удалось загрузить активные игры.');
          setLoading(false);
        }
      );

      // Подписка на историю игр текущего пользователя (статус 'completed')
      const historyGamesQuery = query(
        collection(db, 'games'),
        where('status', '==', 'completed'),
        where('players', 'array-contains', user.id)
      );
      const unsubscribeHistory = onSnapshot(
        historyGamesQuery,
        (snapshot) => {
          const games: GameWithId[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              imageUrl: data.imageUrl,
              betAmount: data.betAmount,
              status: data.status,
              rounds: data.rounds || [],
              players: data.players || [],
              finalResult: data.finalResult,
              filter: data.filter, // Добавлено для фильтрации
              player1: data.player1,
              player2: data.player2,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              // Добавьте другие свойства, если необходимо
            };
          });
          setGameHistory(games);
          setLoading(false);
        },
        (err) => {
          console.error('Ошибка при получении истории игр:', err);
          setError('Не удалось загрузить историю игр.');
          setLoading(false);
        }
      );

      // Очистка подписок при размонтировании компонента
      return () => {
        unsubscribeOpen();
        unsubscribeActive();
        unsubscribeHistory();
      };
    }

    // Очистка подписки на открытые игры при отсутствии пользователя
    return () => {
      unsubscribeOpen();
    };
  }, [user]);

  // Фильтрация игр на основе выбранного фильтра
  const getFilteredGames = () => {
    const allGames =
      activeTab === 'Поиск'
        ? openGames
        : activeTab === 'Активные игры'
        ? activeGames
        : gameHistory;
    if (selectedFilter === 'Все') return allGames;
    // Реализуйте логику фильтрации на основе выбранного фильтра
    return allGames.filter((game) => game.filter === selectedFilter);
  };

  const filteredGames = getFilteredGames();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <div className="flex justify-between items-center mb-4">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'Поиск' && <CreateGameButton />}
        </div>
        <Filters options={filters} selectedOption={selectedFilter} onFilterChange={setSelectedFilter} />
        {loading && <p>Загрузка игр...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {filteredGames.length === 0 ? (
              <p>Нет игр для отображения.</p>
            ) : (
              filteredGames.map((game) => (
                <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow">
                  <CharacterCard
                    imageUrl={game.imageUrl}
                    name={game.name}
                    description={game.description}
                    betAmount={game.betAmount}
                    status={game.status}
                    rounds={game.rounds}
                  />
                  {activeTab === 'Поиск' && <JoinGameButton game={game} />}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Play;
