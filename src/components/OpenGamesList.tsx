// src/components/OpenGamesList.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/firebase/clientApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import JoinGameButton from '@/components/Buttons/JoinGameButton';
import { Game as GameType } from '@/types';

// Создаём интерфейс GameWithId, добавляя поле 'id'
interface GameWithId extends GameType {
  id: string;
}

const OpenGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [openGames, setOpenGames] = useState<GameWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const q = query(
      collection(db, 'games'),
      where('status', '==', 'open')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const games: GameWithId[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          const game: GameWithId = {
            id: doc.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            players: data.players,
            betAmount: data.betAmount,
            status: data.status,
            rounds: data.rounds || [],
            player1: {
              userId: data.player1.userId,
              telegramId: String(data.player1.telegramId),
              username: data.player1.username,
            },
            player2: data.player2
              ? {
                  userId: data.player2.userId,
                  telegramId: String(data.player2.telegramId),
                  username: data.player2.username,
                }
              : undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            finalResult: data.finalResult,
            creatorId: data.creatorId,
            currentPlayer: data.currentPlayer,
          };
          return game;
        });

        // Фильтрация на клиенте: исключаем игры, созданные текущим пользователем
        const filteredGames = games.filter(game => game.creatorId !== user?.id);
        setOpenGames(filteredGames);
        setLoading(false);
      },
      (err) => {
        console.error('Ошибка при получении открытых игр:', err);
        setError('Не удалось загрузить открытые игры.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Открытые игры</h2>
      {loading ? (
        <p>Загрузка открытых игр...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : openGames.length === 0 ? (
        <p>Нет открытых игр в данный момент.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {openGames.map((game) => (
            <div
              key={game.id}
              className="border border-gray-300 p-4 rounded-lg shadow"
            >
              <div className="flex items-center mb-2">
                <Image
                  src={game.imageUrl || '/images/game_placeholder.jpg'}
                  alt="Game"
                  width={64}
                  height={64}
                  className="object-cover rounded mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {`Игра от ${game.player1.username}`}
                  </h3>
                  <p>{`Ставка: ${game.betAmount} ETH`}</p>
                </div>
              </div>
              <JoinGameButton game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenGamesList;
