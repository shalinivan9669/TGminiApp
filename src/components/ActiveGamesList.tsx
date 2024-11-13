// src/components/ActiveGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/clientApp'; // Убедитесь, что используете клиентский SDK
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import GameRound from '@/components/GameRound';
import ConfirmJoinButton from '@/components/Buttons/ConfirmJoinButton';
import { Game as GameType, Player } from '@/types'; // Импортируем необходимые интерфейсы

// Создаём интерфейс GameWithId, добавляя поле 'id'
interface GameWithId extends GameType {
  id: string;
}

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

    const q = query(
      collection(db, 'games'),
      where('status', '==', 'active'),
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
            creatorId: '',
            currentPlayer: 'player1'
          };
          return game;
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
              <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">
                  Игра с {opponentUsername}
                </h3>
                <p>Ставка: {game.betAmount} ETH</p>
                {game.player1.userId === user.id && game.player2 && !game.rounds.length && (
                  <ConfirmJoinButton game={game} />
                )}
                {/* Отображение текущих раундов */}
                <GameRound
                  key={game.id}
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
