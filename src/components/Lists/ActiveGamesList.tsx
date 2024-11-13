// src/components/ActiveGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@//firebase/clientApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import { GameWithId } from '@/types';
import PendingGameActions from '@/components/PendingGameActions/PendingGameActions'; // Импортируем новый компонент

const ActiveGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [activeGames, setActiveGames] = useState<GameWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      setActiveGames([]);
      setLoading(false);
      return;
    }

    console.log('Current User ID:', user.id);

    const q = query(
      collection(db, 'games'),
      where('status', 'in', ['pending', 'active']),
      where('players', 'array-contains', user.id)
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
              telegramId: data.player1.telegramId,
              username: data.player1.username,
            },
            player2: data.player2
              ? {
                  userId: data.player2.userId,
                  telegramId: data.player2.telegramId,
                  username: data.player2.username,
                }
              : undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            finalResult: data.finalResult,
            creatorId: data.creatorId,
            currentPlayer: data.currentPlayer,
            pendingBetAmount: data.pendingBetAmount,
            isBetAccepted: data.isBetAccepted,
            totalRounds: data.totalRounds,
            winner: data.winner,
          };
          return game;
        });

        console.log('Active games fetched:', games);

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
                ? game.player2?.username || 'Ожидание второго игрока'
                : game.player1.username;

            return (
              <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">
                  Игра с {opponentUsername}
                </h3>
                <p>Ставка: {game.betAmount} ETH</p>
                {/* Отображение действий для игры в статусе 'pending' */}
                {game.status === 'pending' && game.creatorId === user.id && (
                  <PendingGameActions game={game} />
                )}
                {/* Дополнительные элементы управления для активных игр */}
                {game.status === 'active' && (
                  <button
                    onClick={() => {
                      // Перейти к странице игры
                      window.location.href = `/play/${game.id}`;
                    }}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Перейти к игре
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveGamesList;
