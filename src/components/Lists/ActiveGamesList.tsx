// src/components/Lists/OpenGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/clientApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import JoinGameButton from '../Buttons/JoinGameButton';
import { useAppContext } from '@/app/context/AppContext';
import { GameWithId } from '@/types'; // Импортируем GameWithId

const OpenGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [openGames, setOpenGames] = useState<GameWithId[]>([]); // Изменили тип

  useEffect(() => {
    const q = query(collection(db, 'games'), where('status', '==', 'open'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const games: GameWithId[] = snapshot.docs.map((doc) => {
        const data = doc.data();
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
          },
          player2: data.player2
            ? {
                userId: data.player2.userId,
                telegramId: String(data.player2.telegramId), // Преобразуем number в string
                username: data.player2.username,
              }
            : undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          finalResult: data.finalResult,
        };
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
            <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <img
                  src="/images/game_placeholder.jpg"
                  alt="Game"
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{`Игра от ${game.player1.username}`}</h3>
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
