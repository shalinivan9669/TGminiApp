// src/components/Lists/OpenGamesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/core/firebase/clientApp';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import JoinGameButton from '../Buttons/JoinGameButton';
import { useAppContext } from '@/app/context/AppContext';
import { Game } from '@/types';

const OpenGamesList: React.FC = () => {
  const { user } = useAppContext();
  const [openGames, setOpenGames] = useState<Game[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'games'), where('status', '==', 'open'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const games = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[];
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
