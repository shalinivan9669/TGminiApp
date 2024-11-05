// src/pages/api/games/joinGame.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/adminApp';
import { doc, updateDoc, FieldValue } from 'firebase-admin/firestore';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

interface JoinGameRequest {
  gameId: string;
  userId: string;
  telegramId: string;
  username: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId, userId, telegramId, username } = req.body as JoinGameRequest;

  if (!gameId || !userId || !telegramId || !username) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const gameData = gameSnap.data();

    if (gameData.status !== 'open') {
      return res.status(400).json({ message: 'Game is not open for joining' });
    }

    // Обновляем документ игры
    await updateDoc(gameRef, {
      player2: {
        userId,
        telegramId,
        username,
      },
      status: 'active',
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Отправляем уведомление Player 1 через Telegram
    const message = `Ваш противник ${username} присоединился к игре #${gameId}. Подтвердите участие, чтобы начать игру.`;
    await bot.sendMessage(gameData.player1.telegramId, message);

    return res.status(200).json({ message: 'Joined the game successfully' });
  } catch (error) {
    console.error('Error joining game:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
