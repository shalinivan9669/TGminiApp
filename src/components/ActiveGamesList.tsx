// src/components/ActiveGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/adminApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import GameRound from '@/components/GameRound';
import ConfirmJoinButton from '@/components/Buttons/ConfirmJoinButton';
import { Game as GameType, Round } from '@/types'; // Импортируем необходимые интерфейсы

// Переопределяем интерфейс Player с telegramId типа string
interface PlayerWithStringTelegramId {
  userId: string;
  telegramId: string | number;
  username: string;
  imageUrl?: string;
}

// Создаём новый интерфейс GameWithId, используя PlayerWithStringTelegramId
interface GameWithId extends Omit<GameType, 'player1' | 'player2'> {
  id: string;
  player1: PlayerWithStringTelegramId;
  player2?: PlayerWithStringTelegramId;
}

const ActiveGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [activeGames, setActiveGames] = useState<GameWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!user) {
      setActiveGames([]);
      setLoading(false);
      return;
    }

    // Создаём запрос к Firestore для получения активных игр пользователя
    const q = query(
      collection(db, 'games'),
      where('status', '==', 'active'),
      where('player1.userId', '==', user.id) // Или 'player2.userId' в зависимости от роли
    );

    // Подписываемся на изменения в коллекции игр
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const games: GameWithId[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Создаём объект игры с добавленным полем 'id' и преобразованием telegramId в string
          return {
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
              telegramId: String(data.player1.telegramId), // Преобразуем number в string
              username: data.player1.username,
              imageUrl: data.player1.imageUrl, // optional
            },
            player2: data.player2
              ? {
                  userId: data.player2.userId,
                  telegramId: String(data.player2.telegramId), // Преобразуем number в string
                  username: data.player2.username,
                  imageUrl: data.player2.imageUrl, // optional
                }
              : undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            finalResult: data.finalResult,
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

    // Очистка подписки при размонтировании компонента
    return () => unsubscribe();
  }, [user]);

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
        <p>Загрузка активных игр...</p>
      </div>
    );
  }

  // Отображение ошибки, если она есть
  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Дополнительная проверка на наличие пользователя
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
            // Вспомогательная переменная для имени соперника
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
                {/* Компонент для подтверждения участия Player 1 */}
                {game.player1.userId === user.id && game.player2 && !game.rounds.length && (
                  <ConfirmJoinButton game={game} />
                )}
                {/* Отображение текущих раундов */}
                {game.rounds.map((round, index) => (
                  <GameRound
                    key={index}
                    game={game}
                    currentPlayer={
                      user.id === game.player1.userId ? 'player1' : 'player2'
                    }
                  />
                ))}
                {/* Дополнительные элементы управления по необходимости */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveGamesList;
