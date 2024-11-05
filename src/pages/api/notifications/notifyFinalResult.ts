// src/pages/api/notifications/notifyFinalResult.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/adminApp';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

interface NotifyFinalResultRequest {
  gameId: string;
  finalResult: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId, finalResult } = req.body as NotifyFinalResultRequest;

  if (!gameId || !finalResult) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const gameData = gameSnap.data();

    // Отправляем уведомления обоим игрокам
    await bot.sendMessage(gameData.player1.telegramId, finalResult);
    await bot.sendMessage(gameData.player2.telegramId, finalResult);

    return res.status(200).json({ message: 'Final result notifications sent' });
  } catch (error) {
    console.error('Error sending final result notifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
