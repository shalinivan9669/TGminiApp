// src/components/ActiveGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/clientApp'; // Клиентский SDK Firestore
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import GameRound from '@/components/GameRound';
import ConfirmJoinButton from '@/components/Buttons/ConfirmJoinButton';
import { GameWithId } from '@/types';
import { useRouter } from 'next/navigation';

const ActiveGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [activeGames, setActiveGames] = useState<GameWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setActiveGames([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'games'),
      where('status', 'in', ['open', 'pending', 'active']),
      where('players', 'array-contains', user.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const games: GameWithId[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Преобразование полей даты
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date();

          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            players: data.players || [],
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
            createdAt: createdAt,
            updatedAt: updatedAt,
            finalResult: data.finalResult,
            creatorId: data.creatorId,
            currentPlayer: data.currentPlayer,
            filter: data.filter || '', // Добавляем значение по умолчанию, если необходимо
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

    return () => unsubscribe();
  }, [user]);

  const handleConnect = (gameId: string) => {
    router.push(`/play/${gameId}`);
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
        <p>Загрузка активных игр...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
        <p>Пожалуйста, войдите в систему, чтобы увидеть ваши активные игры.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
      {activeGames.length === 0 ? (
        <p>У вас нет активных игр.</p>
      ) : (
        <div className="space-y-4">
          {activeGames.map((game) => {
            const opponentUsername =
              game.player1.userId === user.id
                ? game.player2?.username || 'Неизвестный игрок'
                : game.player1.username;

            return (
              <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={game.imageUrl || '/images/game_placeholder.jpg'}
                      alt="Game"
                      className="w-16 h-16 object-cover rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{`Игра с ${opponentUsername}`}</h3>
                      <p>{`Ставка: ${game.betAmount} ETH`}</p>
                      <p>{`Статус: ${game.status}`}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* Кнопка "Подключиться" */}
                    <button
                      onClick={() => handleConnect(game.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Подключиться
                    </button>

                    {/* Если игра находится в статусе 'pending', показываем кнопки подтверждения/отклонения */}
                    {game.status === 'pending' && game.creatorId === user.id && (
                      <ConfirmJoinButton game={game} />
                    )}
                  </div>
                </div>
                {/* Отображение текущих раундов или других деталей игры */}
                <GameRound
                  game={game}
                  currentPlayer={game.player1.userId === user.id ? 'player1' : 'player2'}
                />
                {/* Дополнительные элементы управления */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveGamesList;
