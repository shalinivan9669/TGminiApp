// src/components/OpenGamesList.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/firebase/clientApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import JoinGameButton from '@/components/Buttons/JoinGameButton';
import { useAppContext } from '@/app/context/AppContext';
import { Game as GameType, Player } from '@/types'; // Импортируем интерфейс Game

// Создаём новый интерфейс, добавляя свойство 'id'
interface GameWithId extends GameType {
  id: string;
}

const OpenGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [openGames, setOpenGames] = useState<GameWithId[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'games'), where('status', '==', 'open'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const games: GameWithId[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Преобразуем данные из Firestore в объект типа GameWithId
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
        };
        return game;
      });
      setOpenGames(games);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Открытые игры</h2>
      {openGames.length === 0 ? (
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
