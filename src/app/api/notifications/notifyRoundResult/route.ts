// app/api/notifications/notifyRoundResult/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
// import TelegramBot from 'node-telegram-bot-api';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

interface NotifyRoundResultRequest {
  gameId: string;
  roundNumber: number;
  result: string; // 'player1Win', 'player2Win', 'tie'
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  let body: NotifyRoundResultRequest;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId, roundNumber, result } = body;

  if (!gameId || typeof gameId !== 'string' || !roundNumber || typeof roundNumber !== 'number' || !result) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
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
    // await bot.sendMessage(gameData.player1.telegramId, message);
    // await bot.sendMessage(gameData.player2.telegramId, message);
    console.log(`Round result notification: ${message}`);

    return NextResponse.json({ message: 'Notifications sent' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending round result notifications:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [notifyRoundResult API] Request End ---');
  }
}
