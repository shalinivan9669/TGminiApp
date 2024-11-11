// src/components/ActiveGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/adminApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAppContext } from '@/app/context/AppContext';
import GameRound from '@/components/GameRound';
import ConfirmJoinButton from '@/components/Buttons/ConfirmJoinButton';

interface Game {
  id: string;
  player1: {
    userId: string;
    telegramId: string;
    username: string;
  };
  player2: {
    userId: string;
    telegramId: string;
    username: string;
  };
  betAmount: number;
  status: string;
  rounds: any[];
  createdAt: any;
  updatedAt: any;
}

const ActiveGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [activeGames, setActiveGames] = useState<Game[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'games'),
      where('status', '==', 'active'),
      where('player1.userId', '==', user.id) // Или 'player2.userId' в зависимости от роли
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const games: Game[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Game));
      setActiveGames(games);
    });

    return () => unsubscribe();
  }, [user.id]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Активные игры</h2>
      {activeGames.length === 0 ? (
        <p>У вас нет активных игр.</p>
      ) : (
        <div className="space-y-4">
          {activeGames.map((game) => (
            <div key={game.id} className="border border-gray-300 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                Игра с {game.player1.userId === user.id ? game.player2.username : game.player1.username}
              </h3>
              <p>Ставка: {game.betAmount} ETH</p>
              {/* Компонент для подтверждения участия Player 1 */}
              {game.player1.userId === user.id && !game.rounds.length && (
                <ConfirmJoinButton game={game} />
              )}
              {/* Отображение текущих раундов */}
              {game.rounds.map((round, index) => (
                <GameRound key={index} game={game} currentPlayer={user.id === game.player1.userId ? 'player1' : 'player2'} />
              ))}
              {/* Дополнительные элементы управления по необходимости */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveGamesList;
