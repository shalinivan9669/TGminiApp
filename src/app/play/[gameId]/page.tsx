// src/app/play/[gameId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RoundsList from '@/components/RoundsList';
import MakeMoveButton from '@/components/MakeMoveButton';
import { db } from '@/firebase/clientApp';
import { doc, onSnapshot } from 'firebase/firestore';
import { GameWithId } from '@/types';
import { useAppContext } from '@/app/context/AppContext';
import PendingGameActions from '@/components/PendingGameActions/PendingGameActions';
import { FaTimes } from 'react-icons/fa'; // Импортируем иконку крестика

const PlayGame: React.FC = () => {
  const params = useParams();
  const gameId = params?.gameId as string;
  const router = useRouter();

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

  if (loading) return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!gameData) return <div className="text-center p-4">Игра не найдена.</div>;

  // Определяем роль текущего пользователя
  let currentPlayerRole: 'player1' | 'player2' | null = null;
  if (gameData.player1.userId === user?.id) {
    currentPlayerRole = 'player1';
  } else if (gameData.player2?.userId === user.id) {
    currentPlayerRole = 'player2';
  }

  if (!currentPlayerRole) {
    return <p className="text-center p-4">Вы не участвуете в этой игре.</p>;
  }

  // Функция для закрытия окна игры
  const handleClose = () => {
    console.log('Закрытие окна игры:', gameId);
    router.push('/play'); // Перенаправление на страницу со списком активных игр
  };

  // Если игра в статусе 'pending' и пользователь — создатель, показываем действия подтверждения
  if (gameData.status === 'pending' && user?.id === gameData.creatorId) {
    return (
      <div className="relative p-4 sm:p-6">
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Закрыть окно игры"
        >
          <FaTimes size={24} />
        </button>
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Игра: {gameData.name}</h1>
        <PendingGameActions game={gameData} />
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6">
      {/* Кнопка закрытия */}
      <button
        onClick={handleClose}
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Закрыть окно игры"
      >
        <FaTimes size={24} />
      </button>
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Игра: {gameData.name}</h1>
      <RoundsList rounds={gameData.rounds} currentPlayerRole={currentPlayerRole} />
      {gameData.status === 'active' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-center sm:text-left">Ваш ход:</h2>
          <MakeMoveButton game={gameData} currentPlayerRole={currentPlayerRole} />
        </div>
      )}
      {gameData.status === 'completed' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-center sm:text-left">Игра завершена!</h2>
        </div>
      )}
    </div>
  );
};

export default PlayGame;
