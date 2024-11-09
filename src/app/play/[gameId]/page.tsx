// src/app/play/[gameId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RoundsList from '@/components/RoundsList';
import MakeMoveButton from '@/components/MakeMoveButton';
import { db } from '@/firebase/clientApp';
import { doc, onSnapshot } from 'firebase/firestore';
import { Game } from '@/types';

const PlayGame: React.FC = () => {
  const params = useParams();
  const gameId = params?.gameId as string;

  const [gameData, setGameData] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (gameId) {
      console.log('Fetching game with ID:', gameId); // Логирование gameId
      const gameDocRef = doc(db, 'games', gameId);
      const unsubscribe = onSnapshot(
        gameDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() } as Game;
            console.log('Fetched game data:', data); // Логирование данных игры
            setGameData(data);
          } else {
            setError('Игра не найдена.');
          }
          setLoading(false);
        },
        (err) => {
          console.error('Ошибка при получении данных игры:', err);
          setError('Не удалось загрузить данные игры.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setError('Некорректный ID игры.');
      setLoading(false);
    }
  }, [gameId]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!gameData) return <div>Игра не найдена.</div>;

  const player1Id = gameData.player1.id;
  const player2Id = gameData.player2?.id || '';

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Игра: {gameData.name}</h1>
      <RoundsList rounds={gameData.rounds} />
      {gameData.status === 'active' && (
        <div className="mt-4">
          <h2 className="text-xl">Ходы:</h2>
          <div className="flex space-x-4">
            {/* Кнопки для Player1 */}
            <div>
              <p>{gameData.player1.username} ходит:</p>
              <MakeMoveButton gameId={gameId} userId={player1Id} move="rock" />
              <MakeMoveButton gameId={gameId} userId={player1Id} move="paper" />
              <MakeMoveButton gameId={gameId} userId={player1Id} move="scissors" />
            </div>
            {/* Кнопки для Player2 */}
            {player2Id && (
              <div>
                <p>{gameData.player2.username} ходит:</p>
                <MakeMoveButton gameId={gameId} userId={player2Id} move="rock" />
                <MakeMoveButton gameId={gameId} userId={player2Id} move="paper" />
                <MakeMoveButton gameId={gameId} userId={player2Id} move="scissors" />
              </div>
            )}
          </div>
        </div>
      )}
      {gameData.status === 'completed' && (
        <div className="mt-4">
          <h2 className="text-xl">Игра завершена!</h2>
          <p>Итоговый результат: {gameData.finalResult}</p>
        </div>
      )}
    </div>
  );
};

export default PlayGame;
