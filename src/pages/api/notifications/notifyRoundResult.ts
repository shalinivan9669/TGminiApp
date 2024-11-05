// src/pages/api/notifications/notifyRoundResult.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/adminApp';
import TelegramBot from 'node-telegram-bot-api';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

interface NotifyRoundResultRequest {
  gameId: string;
  roundNumber: number;
  result: string; // 'player1Win', 'player2Win', 'tie'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId, roundNumber, result } = req.body as NotifyRoundResultRequest;

  if (!gameId || !roundNumber || !result) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const gameData = gameSnap.data();

    let message = '';
    if (result === 'tie') {
      message = `Раунд ${roundNumber} закончился ничьей!`;
    } else if (result === 'player1Win') {
      message = `Раунд ${roundNumber}: ${gameData.player1.username} победил!`;
    } else if (result === 'player2Win') {
      message = `Раунд ${roundNumber}: ${gameData.player2.username} победил!`;
    }

    // Отправляем уведомления обоим игрокам
    await bot.sendMessage(gameData.player1.telegramId, message);
    await bot.sendMessage(gameData.player2.telegramId, message);

    return res.status(200).json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Error sending round result notifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
