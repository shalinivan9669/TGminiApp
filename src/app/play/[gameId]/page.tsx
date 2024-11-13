// src/app/play/[gameId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RoundsList from '@/components/RoundsList';
import MakeMoveButton from '@/components/MakeMoveButton';
import { db } from '@/firebase/clientApp';
import { doc, onSnapshot } from 'firebase/firestore';
import { GameWithId } from '@/types';
import { useAppContext } from '@/app/context/AppContext';
import PendingGameActions from '@/components/PendingGameActions/PendingGameActions';

const PlayGame: React.FC = () => {
  const params = useParams();
  const gameId = params?.gameId as string;

  const { user } = useAppContext();

  const [gameData, setGameData] = useState<GameWithId | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (gameId) {
      console.log('Fetching game with ID:', gameId);
      const gameDocRef = doc(db, 'games', gameId);
      const unsubscribe = onSnapshot(
        gameDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const game: GameWithId = {
              id: docSnap.id,
              name: data.name,
              description: data.description,
              imageUrl: data.imageUrl,
              players: data.players,
              betAmount: data.betAmount,
              status: data.status,
              rounds: data.rounds || [],
              player1: data.player1,
              player2: data.player2,
              creatorId: data.creatorId,
              currentPlayer: data.currentPlayer,
              pendingBetAmount: data.pendingBetAmount,
              isBetAccepted: data.isBetAccepted,
              totalRounds: data.totalRounds,
              winner: data.winner,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              finalResult: data.finalResult,
            };
            console.log('Fetched game data:', game);
            setGameData(game);
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

  // Определяем роль текущего пользователя
  let currentPlayerRole: 'player1' | 'player2' | null = null;
  if (gameData.player1.userId === user?.id) {
    currentPlayerRole = 'player1';
  } else if (gameData.player2?.userId === user?.id) {
    currentPlayerRole = 'player2';
  }

  if (!currentPlayerRole) {
    return <p>Вы не участвуете в этой игре.</p>;
  }

  if (gameData.status === 'pending' && user?.id === gameData.creatorId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Игра: {gameData.name}</h1>
        <PendingGameActions game={gameData} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Игра: {gameData.name}</h1>
      <RoundsList rounds={gameData.rounds} currentPlayerRole={currentPlayerRole} />
      {gameData.status === 'active' && (
        <div className="mt-4">
          <h2 className="text-xl">Ваш ход:</h2>
          <MakeMoveButton game={gameData} currentPlayerRole={currentPlayerRole} />
        </div>
      )}
      {gameData.status === 'completed' && (
        <div className="mt-4">
          <h2 className="text-xl">Игра завершена!</h2>
          <p>
            Победитель:{' '}
            {gameData.winner === 'draw'
              ? 'Ничья'
              : gameData.winner === 'player1'
              ? gameData.player1.username
              : gameData.player2?.username}
          </p>
          <RoundsList rounds={gameData.rounds} />
        </div>
      )}
    </div>
  );
};

export default PlayGame;
