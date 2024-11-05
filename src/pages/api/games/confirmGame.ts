// src/pages/api/games/confirmGame.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/adminApp';
import { doc, updateDoc, arrayUnion, FieldValue } from 'firebase-admin/firestore';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

interface ConfirmGameRequest {
  gameId: string;
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId, userId } = req.body as ConfirmGameRequest;

  if (!gameId || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const gameData = gameSnap.data();

    if (gameData.status !== 'active') {
      return res.status(400).json({ message: 'Game is not active' });
    }

    if (gameData.player1.userId !== userId) {
      return res.status(403).json({ message: 'Only Player 1 can confirm the game' });
    }

    // Начинаем игру, добавляем первые раунды
    const initialRounds = [
      { roundNumber: 1, player1Move: null, player2Move: null, result: null },
      { roundNumber: 2, player1Move: null, player2Move: null, result: null },
      { roundNumber: 3, player1Move: null, player2Move: null, result: null },
    ];

    await updateDoc(gameRef, {
      rounds: initialRounds,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Отправляем уведомление Player 2 о начале игры
    const startMessage = `Игра #${gameId} началась! Сделайте свой первый ход: камень, ножницы или бумага.`;
    await bot.sendMessage(gameData.player2.telegramId, startMessage);

    return res.status(200).json({ message: 'Game confirmed and started' });
  } catch (error) {
    console.error('Error confirming game:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
