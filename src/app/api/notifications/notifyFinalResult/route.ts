// src/app/api/notifications/notifyFinalResult/route.ts
import { NextResponse } from 'next/server';
// import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/firebase/adminApp';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

interface NotifyFinalResultRequest {
  gameId: string;
  finalResult: string;
}

export async function POST(request: Request) {
  console.log('--- [notifyFinalResult API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: NotifyFinalResultRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId, finalResult } = body;

  if (!gameId || !finalResult) {
    console.log('Missing required fields');
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      console.log('Game not found:', gameId);
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const gameData = gameSnap.data();

    if (!gameData.player1 || !gameData.player2) {
      console.log('Players data missing');
      return NextResponse.json({ message: 'Players data missing' }, { status: 400 });
    }

    // const message = `Игра ${gameId} завершена. Итоговый результат: ${finalResult}.`;
    // await bot.sendMessage(gameData.player1.telegramId, message);
    // await bot.sendMessage(gameData.player2.telegramId, message);
    console.log(`Final result notification: Game ${gameId} completed with result ${finalResult}.`);

    return NextResponse.json({ message: 'Final result notifications sent' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending final result notifications:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    console.log('--- [notifyFinalResult API] Request End ---');
  }
}
