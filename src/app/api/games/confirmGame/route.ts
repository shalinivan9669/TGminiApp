// app/api/games/confirmGame/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/adminApp';
import { doc, updateDoc, FieldValue } from 'firebase-admin/firestore';
// import TelegramBot from 'node-telegram-bot-api';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

interface ConfirmGameRequest {
  gameId: string;
  userId: string;
}

export async function POST(request: Request) {
  console.log('--- [confirmGame API] Request Start ---');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  let body: ConfirmGameRequest;
  try {
    body = await request.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Invalid JSON');
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { gameId, userId } = body;

  if (!gameId || typeof gameId !== 'string' || !userId || typeof userId !== 'string') {
    console.log('Missing or invalid gameId/userId');
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameSnap = await gameRef.get();

    if (!gameSnap.exists) {
      console.log('Game not found:', gameId);
      return NextResponse.json({ message: 'Game not found' }, { status: 404 });
    }

    const gameData = gameSnap.data() as any;

    if (gameData.status !== 'active') {
      console.log('Game is not active');
      return NextResponse.json({ message: 'Game is not active' }, { status: 400 });
    }

    if (gameData.player1.userId !== userId) {
      return NextResponse.json({ message: 'Only Player 1 can confirm the game' }, { status: 403 });
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
    if (gameData.player2 && gameData.player2.telegramId) {
      const startMessage = `Игра #${gameId} началась! Сделайте свой первый ход: камень, ножницы или бумага.`;
      try {
        // await bot.sendMessage(gameData.player2.telegramId, startMessage);
        console.log('Notification sent to Player 2');
      } catch (error) {
        console.error('Error sending notification to Player 2:', error);
      }
    } else {
      console.log('Player 2 data is missing, skipping notification');
    }

    return NextResponse.json({ message: 'Game confirmed and started' }, { status: 200 });
  } catch (error: any) {
    console.error('Error confirming game:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    console.log('--- [confirmGame API] Request End ---');
  }
}
